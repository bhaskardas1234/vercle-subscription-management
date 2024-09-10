from settings import *
from model import *

maximum_number_of_device_allowed = 2

def add_user(data):
     try:
        print("every thing is working")
        name = data["name"]
        email=data["email"]
        phone_number=data["phoneNumber"]
        token=data["token"]
        fingerprint = data["fingerprint"]
        dob = data["dob"]
        identity=data["identity"]
        gender = get_user_gender(data["honorific"])
        new_session_id = str(uuid.uuid4())
        new_session = {
            "session_id": new_session_id,
            "network_info": fingerprint["network"],
            "device_info": fingerprint["deviceInfo"],
            "medium": get_login_medium(fingerprint["medium"]),
            "timestamp": int(time.time()),
            "remarks": "new account creation",
            "expiry": int(time.time() + (90*86400))
        }
        sessions = [new_session]
        active_sessions = [new_session]

        # generate user hash
        hash_string = '#'.join([name, email, phone_number, dob, gender, str(int(time.time()))]);
        print(hash_string)
        print(hash_string.encode('utf-8'))
        user_hash = generate_hash(hash_string.encode('utf-8'))
        
        new_user=USER(name=name,email=email,phone_number=phone_number, dob=dob, gender=gender, token=token,sessions=sessions,active_sessions=active_sessions,identity=identity)
        new_user.user_hash = user_hash
        new_user.notes, new_user.status = [], "ACTIVE"
        db.session.add(new_user)
        print("user id------------------",new_user.id)
        
        
        db.session.commit()

        ## inatialize wallet for the user at the registration time
        wallet_details=Wallet( user_id=new_user.id, balance=0)
        db.session.add(wallet_details)
        db.session.commit()
        response = make_response(jsonify({
            "success": "user registered successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "phone_number": new_user.phone_number,
                "dob": new_user.dob,
                "gender": new_user.gender
            },
            "session_id": new_session_id
        }))

        # Set cookies
        expires = datetime.now() + timedelta(days=90)
        # response.set_cookie('user_id', str(new_user.id), samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")
        response.set_cookie('user_id', str(new_user.id), samesite='None', expires=expires, secure=True)
        
        # response.set_cookie('session_id', str(new_session_id), samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")
        response.set_cookie('session_id', str(new_session_id), samesite='None', expires=expires, secure=True)
        #response.set_cookie('session_id', str(new_session_id), samesite='Lax', expires=expires)


        
        
        

        return response
   
     except Exception as e:
        print(e)
        return jsonify({"error":"Error in registering user"}), 500
       
def update_user(data, user_id, session_id):
    try:
        print("every thing is working")
        name = data["name"]
        email=data["email"]
        phone_number=data["phoneNumber"]
        token=""
        fingerprint = data["fingerprint"]
        dob = data["dob"]
        print(data)
        existing_user=USER.query.filter_by(id=user_id).first()
        if not existing_user:
            print('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
            return jsonify({"error": f"USER not found with id : {user_id}"}), 400
        updated_active_sessions, removed_session = find_and_remove_session_by_id(existing_user.active_sessions, session_id)
        if removed_session == None:
            return jsonify({"error" : "error in updating, session is expired or not found "}), 400
        
        new_session_id = str(uuid.uuid4())
        new_session = {
            "session_id": new_session_id,
            "network_info": fingerprint["network"],
            "device_info": fingerprint["deviceInfo"],
            "medium": get_login_medium(fingerprint["medium"]),
            "timestamp": int(time.time()),
            "remarks": "update user details",
            "expiry": int(time.time() + (90*86400))
        }
        print(".................session.......................")
        print(updated_active_sessions)
        print(".................session.......................")
        user_sessions, user_active_sessions = existing_user.sessions, updated_active_sessions
        user_active_sessions.append(new_session)
        user_sessions.append(new_session)
        print("........................................")
        print(fingerprint)
        print(user_sessions)
        print(user_active_sessions)
        print("........................................")
        stmt = (update(USER).where(USER.id == user_id).values(name= name, email=email, phone_number=phone_number, dob=dob, sessions = user_sessions, active_sessions=user_active_sessions, last_login=int(time.time())))
        db.session.execute(stmt)
        db.session.commit()
        updated_user = USER.query.filter_by(id = user_id).first()
        session_details, verdict = find_session_by_id(sessions=updated_user.active_sessions, session_id=new_session_id)
        if verdict == False:
            return jsonify({"error": f"user do not have active session in this device"}), 404
        user_info = updated_user.get_user_info()
        user_info["session_info"] = session_details

        response = make_response(user_info, 200)
        # Set cookies
        expires = datetime.now() + timedelta(days=90)
        # response.set_cookie('user_id', str(user_id), samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")
        response.set_cookie('user_id', str(user_id), samesite='None', expires=expires, secure=True)
        # response.set_cookie('session_id', new_session_id, samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")
        response.set_cookie('session_id', new_session_id, samesite='None', expires=expires, secure=True)

        return response
    except Exception as e:
        print('_________________________________________________________________')
        print(e)
        return jsonify({"error":"Error in updating user"}), 500

def find_user_in_db(data, type):
    try:
        id = data["id"]
        print(id)
        print(type)
        existing_user = None
        if type == "phone":
            existing_user = USER.query.filter_by(phone_number=id).first()
        elif type == "email":
            existing_user = USER.query.filter_by(email=id).first()
        if existing_user:
            if existing_user.status == "BLOCKED":
                return jsonify({"error": "you are blocked"}), 400
            
            user_info = existing_user.get_user_info()
            actual_active_sessions = get_total_active_sessions(existing_user.active_sessions)
            user_info["is_eligible_to_login"] = False if len(actual_active_sessions) >= maximum_number_of_device_allowed else True
            print("active..........", actual_active_sessions)
            stmt = (update(USER).where(USER.id == existing_user.id).values(active_sessions=actual_active_sessions))
            db.session.execute(stmt)
            db.session.commit()
            return jsonify({
                "message": "user already exists",
                "user_info": user_info
                }), 200
        return jsonify({"message": "user does not exists"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
    
def save_user_session(data):
    try:
        user_id = data["id"]
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"USER with id: {user_id} not found"}), 404
        user_sessions, user_active_sessions = user.sessions, user.active_sessions
        new_session_id = str(uuid.uuid4())
        new_session_entry = {
            "session_id": new_session_id,
            "network_info": data["network_info"],
            "device_info": data["device_info"],
            "timestamp": int(time.time()),
            "remarks": "save user session while login",
            "expiry": int(time.time() + (90*86400))
        }
        print(new_session_entry)
        user_sessions.append(new_session_entry)
        user_active_sessions.append(new_session_entry)
        # user.sessions, user.active_sessions = user_sessions, active_sessions
        stmt = (update(USER).where(USER.id == user_id).values(sessions = user_sessions, active_sessions=user_active_sessions, last_login=int(time.time())))
        print(type(user_sessions))
        print(user_sessions)
        db.session.execute(stmt)
        db.session.commit()

        response = make_response(jsonify({
            "success": "user registered successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number,
                "dob": user.dob,
                "medium" : data["medium"]
            },
            "session_id": new_session_id
        }), 200)

        # Set cookies
        expires = datetime.now() + timedelta(days=365)
        # response.set_cookie('user_id', str(user.id), samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")
        response.set_cookie('user_id', str(user.id), samesite='None', expires=expires, secure=True)
        response.set_cookie('session_id', new_session_id, samesite='None', expires=expires, secure=True)
        # response.set_cookie('session_id', new_session_id, samesite='None', expires=expires, secure=True, domain=".setucodeverse.net")

        return response, 200
        # return jsonify({"message" : "user session updated successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def remove_user_session(user_id, session_id):
    try:
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with user id {user_id} not found"}), 404
        user_active_sessions = user.active_sessions
        print(user_active_sessions)
        updated_active_sessions, removed_session = find_and_remove_session_by_id(user_active_sessions, session_id)
        if removed_session == None:
            return jsonify({"error": f"session for user with id : {user_id} and session id: {session_id} not found"}), 404
        stmt = update(USER).where(USER.id == user_id).values(active_sessions=updated_active_sessions)
        db.session.execute(stmt)
        db.session.commit()
        response = make_response(jsonify({
            "message": "successfully logged out",
            "session": removed_session
        }))
        # response.set_cookie("user_id", expires=0)
        # response.set_cookie("session_id", expires=0)
        return response, 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
    
def reset_active_session():
    try:
        all_user = USER.query.all()
        for _, user in enumerate(all_user):
            user.active_sessions = []
        db.session.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": f"error {str(e)}"}), 500

def logout_from_all_device(user_id):
    try:
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with user id {user_id} not found"}), 404
        user_active_sessions = user.active_sessions
        all_user = USER.query.filter(USER.user_hash == user.user_hash).all()
        print(all_user)
        for i, user in enumerate(all_user):
            print(user_active_sessions)
            updated_active_sessions = []
            stmt = update(USER).where(USER.id == user.id).values(active_sessions=updated_active_sessions)
            db.session.execute(stmt)

        db.session.commit()

        response = make_response(jsonify({
            "message": "successfully logged out from all device"
        }))
        # response.set_cookie("user_id", expires=0)
        # response.set_cookie("session_id", expires=0)
        return response, 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def eligible_to_login_in_this_device(data):
    try:
        user_id = data["id"]
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def find_and_remove_session_by_id(sessions, session_id):
    for i, session in enumerate(sessions):
        if session["session_id"] == session_id:
            removed_session = sessions.pop(i)
            return sessions, removed_session
    return sessions, None

def logout_user():
    pass

def find_user_in_db_with_utility(data:any, type:str):
    """Find the user with the email or phone present in the db
    if type=phone find email presence and reverse is also happen

    Args:
        data (any): id1 = phone and id2 = email, data is in json format
        type (str): type of checking

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | tuple[Response, Literal[500]]: Api response according to the result in db query with status code
    """    
    try:
        phone = data["id1"]
        email = data["id2"]

        print(type)
        existing_user = None
        if type == "phone":
            existing_user = USER.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({
                    "status": "failed",
                    "message": "Another user already registered with this email"
                }), 404
            else:
                return jsonify({
                    "status": "success",
                    "message": "email not registered with anyone"
                }), 200
        elif type == "email":
            existing_user = USER.query.filter_by(phone_number=phone).first()
            if existing_user:
                return jsonify({
                    "status": "failed",
                    "message": "Another user already registered with this phone"
                }), 404
            else:
                return jsonify({
                    "status": "success",
                    "message": "phone not registered with anyone"
                }), 200
        # if existing_user:
        #     user_info = existing_user.get_user_info()
        #     print("no. of session active : ", len(existing_user.active_sessions))
        #     user_info["is_eligible_to_login"] = False if len(existing_user.active_sessions) >= maximum_number_of_device_allowed else True
        #     return jsonify({
        #         "message": "user already exists",
        #         "user_info": user_info
        #         }), 200
        return jsonify({"message": "user does not exists"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def find_session_by_id(sessions:list[any], session_id:int):
    for i, session in enumerate(sessions):
        if session["session_id"] == session_id:
            return session, True
    return sessions, False

def get_user_details(user_id:int, session_id:str):
    """Get user details of the user

    Args:
        user_id (int): user id of the user
        session_id (str): session id of the current user

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | tuple[Response, Literal[500]]: _description_
    """    
    try:
        user = USER.query.filter_by(id=user_id).first();
        if not user:
            return jsonify({"error": f"user with user id : {user_id} not found"}), 404
        active_sessions = user.active_sessions
        session_details, verdict = find_session_by_id(sessions=active_sessions, session_id=session_id)
        if verdict == False:
            return jsonify({"error": f"user do not have active session in this device"}), 404
        user_info = user.get_user_info()
        user_info["session_info"] = session_details
        return jsonify(user_info), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": print(str(e))}), 500

def get_user_sessions(user_id:int):
    """Get all the active session of the user

    Args:
        user_id (int): user id of the user

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | Response: Api response according to the result in db query with status code
    """    
    try:
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with id : {user_id} not found"}), 404
        all_users = USER.query.filter(USER.user_hash == user.user_hash).all()
        active_sessions = [active_session for user in all_users for active_session in user.active_sessions]
        # user_info = user.get_user_info()
        # user_info["active_session"] = active_sessions
        return jsonify({
            "message": "successfully got the user active sessions",
            "active_sessions": active_sessions
        }), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)})

def check_session_status(user_id:int, session_id:str):
    """Check the user session status [active/expired]
    It will search session id the active session and 
    return success response if the session is active
    and error response if the session not found in the
    active session array.

    Args:
        user_id (int): user id of the user
        session_id (str): session id of the user

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | tuple[Response, Literal[500]]: Api response according to the result in db query with status code
    """    
    try:
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with id : {user_id} not found"}), 404
        if user.status == "BLOCKED":
            return jsonify({"error": "you are blocked"}), 400
        # all_users = USER.query.filter(USER.user_hash == user.user_hash).all()
        # active_sessions = [active_session for user in all_users for active_session in user.active_sessions]
        active_sessions = user.active_sessions
        # user_info = user.get_user_info()
        # user_info["active_session"] = active_sessions
        flag = False
        user_session_details = None
        for i, session in enumerate(active_sessions):
            if session["session_id"] == session_id:
                user_session_details = session
                flag = True
        if flag:
            return jsonify({
                "message": "successfully got the user active sessions",
                "active_sessions": user_session_details
            }), 200
        return jsonify({
                "message": "Session expired/removed"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def merge_users(base_account_id:int, child_account_ids:list[int]):
    """_summary_

    Args:
        base_account_id (int): It is the account id with whome the accounts will be merged
        child_account_ids (list[int]): The list of account ids which will be merged

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | tuple[Response, Literal[500]]: Api response according to the result in db query with status code
    """             
    try:
        # find the base account in user db
        base_user = USER.query.filter_by(id = base_account_id).first()
        if not base_user:
            return jsonify({"error": f"USER with the id : {user_id} not found"}), 404
        # if the user found then get the  hash
        base_user_hash = base_user.user_hash
        print(base_user_hash)
        # find in subscription table about subacription details of the user
        base_user_sub = USER_SUBSCRIPTION.query.filter_by(user_id=base_account_id).first()
        new_sunscriptions = []
        for i, user_id in enumerate(child_account_ids):
            #find existing users in the user db
            existing_user = USER.query.filter_by(id=user_id).first();
            # print(i, "  ", existing_user)
            if not existing_user:
                return jsonify({"error": f"USER with the id : {user_id} not found"}), 404
            new_user_subscription = USER_SUBSCRIPTION(
                user_id = user_id,
                start_day = base_user_sub.start_day,
                end_day = base_user_sub.end_day,
                s_id = base_user_sub.s_id,
                content_details=base_user_sub.content_details
            )
            new_user_subscription.user_hash = base_user_hash
            # add the new subscription objects to add to perform batch commit to db
            new_sunscriptions.append(new_user_subscription)
            # update the user_hash in the user_hash cell if each user
            existing_user.user_hash = base_user_hash
        # use add_all() function which will perform batch insert in db
        db.session.add_all(new_sunscriptions)
        # save the merge log in base account
        db.session.commit()
        
        return(jsonify({
            "success": f"users with ID : {' '.join([str(id) for id in child_account_ids])} merged with the account {base_account_id}"
        })), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
    
def get_total_active_sessions(user_sessions:any):
    actual_active_sessions = []
    for _, session in enumerate(user_sessions):
        if(session["expiry"] > int(time.time())):
            actual_active_sessions.append(session)
    return actual_active_sessions

def get_user_sessions_merged(user_id:int):
    """New function to get the all the active session if user
    It will give the combined active sessions of user after account merge

    Args:
        user_id (int): The user id of user whose active session we want

    Returns:
        tuple[Response, Literal[404]] | tuple[Response, Literal[200]] | tuple[Response, Literal[500]]: Api response according to the result in db query with status code
    """    
    try:
        print(user_id)
        user = USER.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": f"user with id : {user_id} not found"}), 404
        user_hash = user.user_hash
        print(user_hash)
        all_users = USER.query.filter(USER.user_hash == user_hash).all()
        print(all_users)
        # all_active_session = [active_session for user in all_users for active_session in user.active_sessions]
        all_active_session = []
        print(len(all_active_session))
        for i, user in enumerate(all_users):
            user_info = user.get_user_info()
            for active_session in user.active_sessions:
                active_session["user_info"] = user_info
                if active_session["expiry"] > int(time.time()):
                    all_active_session.append(active_session)
        return jsonify({
            "message": "successfully got the user active sessions",
            "active_sessions": all_active_session
        }), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

'''
Utility functions(they are like helper functions, not directly used in route)
'''
def get_user_gender(honorific):
    gender = None
    if honorific == "Mr":
        gender = "Male"
    elif honorific == "Mrs" or honorific == "Ms":
        gender = "Female"
    elif honorific == "Others":
        gender = "Others"
    return gender

def save_payment(data, status):
    payment = Payment(
        order_id=data['razorpay_order_id'],
        payment_id=data['razorpay_payment_id'],
        amount=data['amount'],
        time=datetime.now(),
        status=status,
        user_id=1,
    )
    db.session.add(payment)
    db.session.commit()

def save_payment_details(data):
    payment_info=payment_details(
                                 user_id=data['user_id'],
                                 order_id=data['order_id'],
                                 payment_id=data['payment_id'],
                                 payemnt_status=data["payment_status"],
                                 final_amount=data['final_amount'],
                                 discount=data['discount'],
                                 cupon_code=data['cupon_code'],
                                 payment_method=data['payment_method']
                                 )
    print(payment_info)
    db.session.add(payment_info)
    db.session.commit()
    print("payment details stored sucessfully")

def get_user_by_id(uid):
    try:
        user = USER.query.filter_by(id=uid).first()
        print(uid)
        print(user)
        if user:
            print(user)
            user_info=user.get_user_info()
            return user_info
        return None
    except Exception as e:
        return e

# def eligible_to_login_in_this_device(data):
#     try:
#         user_id = data["id"]
#     except Exception as e:
#         print(str(e))
#         return jsonify({"error": str(e)}), 500

def find_and_remove_session_by_id(sessions, session_id):
    for i, session in enumerate(sessions):
        if session["session_id"] == session_id:
            removed_session = sessions.pop(i)
            return sessions, removed_session
    return sessions, None


def save_user_subscription_details(data):
    try:
        user_id=data['user_id']
        start_day=data['start_day']
        end_day=data['end_day']
        content_details=data['content_details']
        s_id=data['s_id']
        user_hash=data['user_hash']
        order_id=data['order_id']
        
        user_subcription_details=USER_SUBSCRIPTION(user_id=user_id,
                                                start_day=start_day,
                                                end_day=end_day,
                                                s_id=s_id,
                                                content_details=content_details,
                                                user_hash=user_hash,order_id=order_id)
        db.session.add(user_subcription_details)
        db.session.commit()
        print("user_subscription_details stored sucessfully")
        return jsonify({"success":"user_suscription_details not stored succesfully"}),200
    except Exception as e:
        print(e)
        return jsonify({"error":" internal server error user_subscription_details not stored succesfully"}),500
  

def valid_subscription_for_user(uid):
    user = USER_SUBSCRIPTION.query.filter(
    and_(
        USER_SUBSCRIPTION.user_id == uid,
        USER_SUBSCRIPTION.end_day >int(time.time()),
        or_(
            USER_SUBSCRIPTION.s_id==1,
            USER_SUBSCRIPTION.s_id==5
            
        )
    )
        ).first()
    if user:
        print('1098...........................................')
        print(user)
        return  jsonify({"access":"all"})
    else:
        multiple_subscription = USER_SUBSCRIPTION.query.filter(
        and_(
        USER_SUBSCRIPTION.user_id == uid,
        USER_SUBSCRIPTION.end_day >int(time.time()),
        USER_SUBSCRIPTION.s_id==4
        
        )
        ).all()
        list_of_content=[]
        print('1111...........................................')
        print(user)
        for subscription in multiple_subscription:
            content_details =subscription.content_details  # Load JSON string to Python dictionary
            # Access specific keys in the content_details dictionary
            if 'access' in content_details:
                print(f"Key 'key_name' found with value: {content_details['access']}")
                print(type(content_details['access']))
                if content_details['access'] not in list_of_content:
                     list_of_content.append((content_details['access']))

        if len(list_of_content)>0:
            print("working")
            return jsonify({"access":list_of_content})
        else:
             return jsonify({"access":None})



        

#repeat subscription option data add on
def subscription_data_add_on(uid):
    
        subscription_details = USER_SUBSCRIPTION.query.filter(
    and_(
        USER_SUBSCRIPTION.user_id == uid,
        USER_SUBSCRIPTION.end_day > int(time.time()),
        or_(
            USER_SUBSCRIPTION.s_id == 1,
            USER_SUBSCRIPTION.s_id == 5
        )
    )
).order_by(desc(USER_SUBSCRIPTION.end_day)).first()
        if subscription_details:
           return  subscription_details.end_day
        else:
            return  int(time.time())# if subscription monthly and yearly not availble then end will be today
        
    













#suman
def add_article_to_db(title, content, price):
    new_article = Articles(title=title, content=content, price=price)
    try:
        db.session.add(new_article)
        db.session.commit()
        return {"message": "Article added successfully!"}, 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    
def get_all_articles():
    articles = Articles.query.all()
    articles_list = []
    for article in articles:
        articles_list.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'price': article.price
        })
    return jsonify(articles_list)

def get_article_by_id(id):
    article = Articles.query.get(id)
    return article.to_dict() if article else None



def subscriber_by_id(id):
    try:
        user= USER_SUBSCRIPTION.query.filter_by(user_id=id).first()
        if user:
            return jsonify({"success":"exist"}),200
        return jsonify({"success":"notexist"}),200
    except Exception as e:
        print(e)
        return jsonify({"error","internal server error when checking subscriber by id"}),500

        
def articleCost_by_id(id):
    try:
        article = Articles.query.filter_by(id=id).first()
        if article:
            articleCost = article.price
            return jsonify({"article_cost":articleCost}),200
        return jsonify({"success":"article not exists"}),200
    except Exception as e:
        print(e)
        return jsonify({"error","internal server error when checking article cost by id"}),500

# def is_subscription_valid(start_day, end_day):
#     current_epoch = get_current_epoch()
#     return start_day <= current_epoch <= end_day

def get_login_medium(str) -> str:
    medium = ""
    print(str)
    if str == "SMS":
        medium = "Mobile"
    elif str == "GMAIL":
        medium = "Google"
    elif str == "FACEBOOK":
        medium = "Facebook"
    elif str == "WHATSAPP":
        medium = "Whatsapp"
    elif str == "EMAIL":
        medium = "Email"
    print("Mediun :::: ", medium)
    return medium

# def generate_hash(str) -> str:
#     return hashlib.sha256(str).hexdigest()

# def get_current_epoch():
#     return int(time.time())

# def is_subscription_valid(start_day, end_day):
#     current_epoch = get_current_epoch()
#     return start_day <= current_epoch <= end_day

def is_subscription_valid(start_date, end_date):
    current_epoch = get_current_epoch()
    return start_date <= current_epoch <= end_date

def get_current_epoch():
    return int(time.time())

def generate_hash(str) -> str:
    return hashlib.sha256(str).hexdigest()


# Nibiiiiiiiiiiiiiiiiiiiiiiii

#nibi epaperrrrrrr

def save_epaper_subscription_details(data):
    try:
        # Extracting subscription details from the data
        order_id = data['order_id']
        email = data['email']
        start_date = data['start_date']
        end_date = data['end_date']
        first_name = data['first_name']
        mobile_no = data['mobileNo']
        state_name = data['state_name']
        user_hash = data['user_hash']
        user_id=data['user_id']
        content_details = data['content_details']  # Assuming content_details is already a dictionary
        
        # Creating a new epaper subscription entry
        epaper_subscription = EPaper_Subscription(
            order_id=order_id,
            email=email,
            start_date=start_date,
            end_date=end_date,
            first_name=first_name,
            mobileNo=mobile_no,
            state_name=state_name,
            user_hash=user_hash,
            user_id=user_id,
            content_details=content_details
        )
        
        # Storing the subscription details in the database
        db.session.add(epaper_subscription)
        db.session.commit()
        print("epaper_subscription stored successfully")
        
        # Return a simple dictionary indicating success
        return {"status": "success", "message": "epaper_subscription stored successfully"}
    
    except Exception as e:
        print(f"Error in save_epaper_subscription_details: {str(e)}")
        
        # Return an error dictionary
        return {"status": "failure", "error": str(e), "message": "epaper_subscription not stored successfully"}


def valid_epaper_subscription_for_user(uid):
    try:
        # Query to check if the user has an active subscription
        user_subscription = EPaper_Subscription.query.filter(
            and_(
                EPaper_Subscription.user_id == uid,
                EPaper_Subscription.end_date > int(time.time())
            )
        ).first()

        if user_subscription:
            # Directly use content_details since it's already a JSON type
            content_details = user_subscription.content_details
            
            # Ensure content_details is not None and contains expected keys
            if content_details and "access" in content_details and "period" in content_details:
                return jsonify({"access": content_details["access"], "period": content_details["period"]})
            else:
                # Handle cases where content_details is malformed or missing keys
                return jsonify({"access": None, "period": None})
        else:
            return jsonify({"access": None, "period": None})
    except Exception as e:
        print(e)
        return jsonify({"error": "internal server error2, unable to validate subscription"}), 500


def epaper_subscription_data_add_on(uid):
    
        # Query to get the latest subscription end date for the user
        subscription_details = EPaper_Subscription.query.filter(
            and_(
                EPaper_Subscription.user_id == uid,
                EPaper_Subscription.end_date > int(time.time())
            )
        ).order_by(desc(EPaper_Subscription.end_date)).first()

        

        if subscription_details:
            # Ensure end_date is returned as an integer, not a tuple
            return subscription_details.end_date
        else:
            return int(time.time())  # If no active subscription, return the current time
        