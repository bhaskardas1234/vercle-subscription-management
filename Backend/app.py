from settings import *
from module import *

import razorpay
client = razorpay.Client(auth=('rzp_test_XIKIRmwuryqbiu', 'h8a1essXCXzClWJPaxpltaVe'))

@app.route("/", methods=["GET"])
def welcome():
    return "welcome"


@app.route("/add_user", methods=["post"])
def add_user_info():
    userData = request.get_json()
    return add_user(userData)


@app.route("/update_user", methods=["post"])
def update_user_info():
    userData = request.get_json()
    user_id, session_id = userData["uid"], userData["sid"]
    return update_user(userData, user_id, session_id)


@app.route("/get-user", methods=["GET"])
def get_user_info():
    utm = request.args.get("utm")
    if utm == "android":
        user_id = request.get_json()["user_id"]
        session_id = request.get_json()["session_id"]
    else:
        user_id = request.cookies.get("user_id")
        session_id = request.cookies.get("session_id")
    response, status_code = get_user_details(user_id, session_id)
    return response, status_code


@app.route("/find-user", methods=["POST"])
def find_user_in_db_route():
    data = request.get_json()
    type = request.args.get("type")
    response, status_code = find_user_in_db(data, type)
    return response, status_code


@app.route("/find-user-utility", methods=["POST"])
def find_user_in_db_with_utility_route():
    data = request.get_json()
    type = request.args.get("type")
    response, status_code = find_user_in_db_with_utility(data, type)
    return response, status_code


@app.route("/save-user-session", methods=["POST"])
def save_user_session_route():
    data = request.get_json()
    response, status_code = save_user_session(data)
    return response, status_code


@app.route("/remove-user-session", methods=["POST"])
def remove_user_session_route():
    user_id = request.get_json()["user_id"]
    session_id = request.get_json()["session_id"]
    print(f"{user_id} :: {session_id}")
    response, status_code = remove_user_session(user_id, session_id)
    return response, status_code


@app.route("/logout-from-all-device", methods=["POST"])
def logout_from_all_device_route():
    utm = request.args.get("utm")
    if utm == "android":
        user_id = request.get_json()["user_id"]
    else :
        user_id = request.cookies.get("user_id")
    response, status_code = logout_from_all_device(user_id)
    return response, status_code


@app.route("/get-all-sessions", methods=["GET", "POST"])
def get_all_session_route():
    utm = request.args.get("utm")
    if utm == "android":
        user_id = request.get_json()["user_id"]
    else :
        user_id = request.cookies.get("user_id")
    # response, status_code = get_user_sessions(user_id)
    response, status_code = get_user_sessions_merged(user_id)
    return response, status_code


@app.route("/check-session-status", methods=["GET"])
def check_session_status_route():
    utm = request.args.get("utm")
    if utm == "android":
        user_id, session_id = request.get_json()["user_id"], request.get_json()[
            "session_id"]
    else :
        user_id, session_id = request.cookies.get("user_id"), request.cookies.get(
            "session_id"
        )
    response, status_code = check_session_status(user_id, session_id)
    return response, status_code

@app.route("/merge-users", methods=["POST"])
def merge_users_route():
    data = request.get_json()
    base_account_id, child_account_ids = data["base_account_id"], data["child_account_ids"]
    response, status_code = merge_users(base_account_id, child_account_ids)
    return response, status_code

@app.route('/create_order', methods=['POST'])
def create_order():
    data=request.json
    print("check------------------------------------------------->",data)

    try:
        course_amount = float(request.json['courseAmount'])  # Convert INR to paisa
        print("thisssssssss",course_amount)
        print(client)
        print(client.order)
        course_amount= round(course_amount*100, 2)
        order = client.order.create({
            'amount': course_amount,
            'currency': 'INR',
            'payment_capture': 1  # Auto capture payment when order is created
        })
        print("order created",order)
        return jsonify({'order_id': order['id']}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/record_payment_failure', methods=['POST'])
def record_payment_failure():
    data = request.json
    print("failure data...........................")
    print(data)
    razorpay_payment_id = data['razorpay_payment_id']
    razorpay_order_id = data['razorpay_order_id']
    uid=data['uid']
    money=data['money']
    payment_info=get_user_by_id(uid)#featch user data as uid
    print(payment_info)
    result = client.payment.fetch(razorpay_payment_id)
        #payment method fetch  from  razorpay
    payment_method = {
            "method": result["method"],
            "details": None
        }
        
    if result['method'] == 'netbanking':
            payment_method["details"] = result["bank"]
    elif result['method'] == 'upi':
            payment_method["details"] = result["vpa"]
    elif result['method'] == 'card':
            payment_method["details"] = result["card_id"]
    payment_details={
        
        "user_id":uid,
        "order_id":razorpay_order_id,
        "payment_id":razorpay_payment_id,
        "payment_status":"failed",
        "final_amount":money,
        "discount":0.0,
        "cupon_code":"None",
        "payment_method":payment_method


    } 
    save_payment_details(payment_details)
    return jsonify({'status': 'Payment failed  and stored data sucessfully'})

#subscription validity how long su
@app.route('/subscription_validity',methods=['POST'])
def subscription_validity_check():
    try:
        data=request.json
        print(data)
        uid=data['user_id']
        response=valid_subscription_for_user(uid)
        return response
    except Exception as e:
        print(e)
        return jsonify({'error':"internal server error when checking subscription validation"}),500


# @app.route('/verify_payment', methods=['POST'])
# def verify_payment():
#     data = request.json
#     print(data)
#     razorpay_payment_id = data['razorpay_payment_id']
#     razorpay_order_id = data['razorpay_order_id']
#     razorpay_signature = data['razorpay_signature']
#     uid = data['uid']
#     money = data['money']
#     recharge_type = data['rechargeType']
#     user_hash = None

#     duration = int(data['duration'])
#     contentId = data.get('contentId')  # Use get() to handle the possibility of contentId being absent or None

#     if contentId is not None:
#         contentId = int(contentId)  # Convert to int only if it is not None

#     print("requested data------------------------------------")
#     print(data)
#     payment_info = get_user_by_id(uid)
#     if payment_info is None:
#         return jsonify({"error": "user not found"}), 400
#     elif isinstance(payment_info, Exception):
#         return jsonify({"error": "internal server error"}), 500
#     user_hash = payment_info['user_hash']

#     print("user data for whom data will be stored")
#     print("payment_info", payment_info)
#     print(type(payment_info))
#     print(tuple(payment_info))

#     try:
#         # Verify payment signature
#         client.utility.verify_payment_signature({
#             'razorpay_payment_id': razorpay_payment_id,
#             'razorpay_order_id': razorpay_order_id,
#             'razorpay_signature': razorpay_signature
#         })
#         result = client.payment.fetch(razorpay_payment_id)
#         # payment method fetch from razorpay
#         payment_method = {
#             "method": result["method"],
#             "details": None
#         }

#         if result['method'] == 'netbanking':
#             payment_method["details"] = result["bank"]
#         elif result['method'] == 'upi':
#             payment_method["details"] = result["vpa"]
#         elif result['method'] == 'card':
#             payment_method["details"] = result["card_id"]

#         payment_details = {
#             "user_id": uid,
#             "order_id": razorpay_order_id,
#             "payment_id": razorpay_payment_id,
#             "payment_status": "success",
#             "final_amount": money,
#             "discount": 0.0,
#             "cupon_code": "max",
#             "payment_method": payment_method
#         }

#         print("success payload to be stored in database--------------------------------------------->")
#         print(payment_details)
#         # If signature verification passes, mark payment as successful and save in database
#         save_payment_details(payment_details)

#         if recharge_type == 'wallet':
#             wallet = Wallet.query.filter_by(user_id=uid).first()

#             if wallet:
#                 wallet.balance += money
#             else:
#                 new_wallet = Wallet(user_id=uid, balance=money)
#                 db.session.add(new_wallet)
#             db.session.commit()

#             if contentId is not None:
#                 price = 0
#                 article = get_article_by_id(contentId)
#                 if article is not None:
#                     price = article['price']

#                 if wallet.balance >= price:
#                     wallet.balance -= price
#                     end_day = 0
#                     start_day = subscription_data_add_on(uid)
#                     end_day = start_day + (5 * 60)
#                     accesslevel = json.dumps({"access": contentId})

#                     data = {
#                         "user_id": uid,
#                         "start_day": start_day,
#                         "end_day": end_day,
#                         "s_id": 4,
#                         "content_details": accesslevel,
#                         "user_hash": user_hash,
#                     }
#                     save_user_subscription_details(data)
#                     payment_details = {
#                         "user_id": uid,
#                         "order_id": '',
#                         "payment_id": ' ',
#                         "payment_status": "success",
#                         "final_amount": price,
#                         "discount": 0.0,
#                         "cupon_code": "max",
#                         "payment_method": {"wallet": price}
#                     }
#                     save_payment_details(payment_details)

#             return jsonify({'status': 'Payment successful'}), 200

#         if contentId is not None:
#             end_day = 0
#             start_day = subscription_data_add_on(uid)
#             if duration == 1:
#                 end_day = start_day + (5 * 60)
#                 s_id = 4
#                 accesslevel = json.dumps({"access": contentId})
#             elif duration == 30:
#                 end_day = start_day + (5 * 60)
#                 s_id = 1
#                 accesslevel = json.dumps({"access": "all"})
#             elif duration == 365:
#                 end_day = start_day + (5 * 60)
#                 s_id = 5
#                 accesslevel = json.dumps({"access": "all"})

#             data = {
#                 "user_id": uid,
#                 "start_day": start_day,
#                 "end_day": end_day,
#                 "s_id": s_id,
#                 "content_details": accesslevel,
#                 "user_hash": user_hash,
#             }

#             save_user_subscription_details(data)

#         return jsonify({'status': 'Payment successful'}), 200
#     except razorpay.errors.SignatureVerificationError as e:
#         # Handle signature verification failure
#         print(f"Signature verification failed: {str(e)}")
#         return jsonify({'error': 'Payment verification failed'}), 400
#     except Exception as e:
#         # Handle other unexpected errors
#         print(f"Payment verification failed: {str(e)}")
#         return jsonify({'error': 'Internal server error'}), 500
# @app.route('/verify_payment', methods=['POST'])
# def verify_payment():
#     data = request.json
#     print(data)
#     razorpay_payment_id = data['razorpay_payment_id']
#     razorpay_order_id = data['razorpay_order_id']
#     razorpay_signature = data['razorpay_signature']
#     uid=request.cookies.get('user_id')
#     money=data['money']
#     recharge_type=data['rechargeType']
#     user_hash=None
    
#     duration=int(data['duration'])
#     contentId=data['contentId']
#     if contentId != None:
#         contentId=int(data['contentId'])
#         print("dnjfjd")


#     print("requested data------------------------------------",type(contentId))
#     print(data)
#     payment_info=get_user_by_id(uid)
#     if payment_info==None:
#         return  jsonify({"error":"user not found"}),400
#     elif isinstance(payment_info,Exception):
#         return jsonify({"error":"internal server error"}),500
#     user_hash=payment_info['user_hash']

#     print("user data for whom data will be stored")
#     print("payment_info",payment_info)
#     print(type(payment_info))
#     print(tuple(payment_info))
    
    
#     try:
#         # Verify payment signature
#         client.utility.verify_payment_signature({
#             'razorpay_payment_id': razorpay_payment_id,
#             'razorpay_order_id': razorpay_order_id,
#             'razorpay_signature': razorpay_signature
#         })
#         result = client.payment.fetch(razorpay_payment_id)
#         #payment method fetch  from  razorpay
#         payment_method = {
#             "method": result["method"],
#             "details": None
#         }
        
#         if result['method'] == 'netbanking':
#             payment_method["details"] = result["bank"]
#         elif result['method'] == 'upi':
#             payment_method["details"] = result["vpa"]
#         elif result['method'] == 'card':
#             payment_method["details"] = result["card_id"]

#         payment_details={
#         "user_id":uid,
#         "order_id":razorpay_order_id,
#         "payment_id":razorpay_payment_id,
#         "payment_status":"success",
#         "final_amount":money,
#         "discount":0.0,
#         "cupon_code":"max",
#         "payment_method":payment_method
#         }

#         print("sucess paylode to be stroed on database--------------------------------------------->")
#         print(payment_details)
#         # If signature verification passes, mark payment as successful and save in database
#         save_payment_details(payment_details)
#         #storing the subscription details
       
#         end_day=0
#         start_day=subscription_data_add_on(uid)# here is 
#         # start_day=0
#         s_id=None
#         accesslevel=None
#         if duration==1:
#             # start_day=int(time.time())
#             # end_day=start_day+(1*24*60*60)
#             end_day=start_day+(5*60)
#             s_id=4
#             accesslevel=json.dumps({"access":contentId})

#         elif duration==30:
#             # start_day=int(time.time())
#             # end_day=start_day+(30*24*60*60)
#             end_day=start_day+(5*60)

#             s_id=1
#             accesslevel=json.dumps({"access":"all"})
            
#         elif duration==365:
#             # start_day=int(time.time())
#             # end_day=start_day+(365*24*60*60)
#             end_day=start_day+(5*60)
#             s_id=5
#             accesslevel=json.dumps({"access":"all"})
        
        
#         data={
#             "user_id":uid,
#             "start_day":start_day,
#             "end_day":end_day,
#             "s_id":s_id,
#             "content_details":accesslevel,
#             "user_hash":user_hash,
#             }
       
        

        

#         if recharge_type!='wallet':
#            save_user_subscription_details(data)

#         print(" this portion is working")
#         # print(data['rechargeType']=='wallet') 
#         if recharge_type=='wallet' and contentId!=None:
            
#             wallet = Wallet.query.filter_by(user_id=uid).first()
#             if wallet:
#               price=0
#               article=get_article_by_id(contentId)
#               if article!=None:
#                   price=article['price']
                
                  
                  

              
#               wallet.balance = wallet.balance+money
#               if wallet.balance>=price:
#                    wallet.balance = wallet.balance-price
#                    save_user_subscription_details(data)
#                    payment_details={
#                             "user_id":uid,
#                             "order_id":'',
#                             "payment_id":' ',
#                             "payment_status":"success",
#                             "final_amount":price,
#                             "discount":0.0,
#                             "cupon_code":"max",
#                             "payment_method":{"method":'wallet'}
#                             }
#                    #wallet reachargh and content price deductio will be stored in the payment details
#                    save_payment_details(payment_details)
#                    #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#                    db.session.commit()
#                    #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#                    return jsonify({"status":"wallet has been recharged and content price has been deducted"}),200
              
#               #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#               else:
#                     #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#                     db.session.commit()
#                     #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#                     return jsonify({"status":"low wallet balance"}),200


#             else:
#                 new_wallet = Wallet(user_id=uid, balance=money)
#                 db.session.add(new_wallet)
#         else:
#          if recharge_type!='content recharge through razorpay' and recharge_type!='subscription' :
#             wallet = Wallet.query.filter_by(user_id=uid).first()
#             wallet.balance = wallet.balance+money 
#             #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#             db.session.commit()
#             #NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
#             return jsonify({"status":"wallet recharge has been successfully done"}),200       
#         db.session.commit()



#         return jsonify({'status': 'Payment successful'}),200
#     except razorpay.errors.SignatureVerificationError as e:
#         # Handle signature verification failure
#         print(f"Signature verification failed: {str(e)}")
#         return jsonify({'error': 'Payment verification failed'}), 400
#     except Exception as e:
#         # Handle other unexpected errors
#         print(f"Payment verification failed: {str(e)}")
#         return jsonify({'error': 'Internal server error'}), 500


@app.route('/verify_payment', methods=['POST'])
def verify_payment():
    data = request.json #request data
    razorpay_payment_id = data['razorpay_payment_id']
    razorpay_order_id = data['razorpay_order_id']
    razorpay_signature = data['razorpay_signature']
    money = float(data['money'])
    recharge_type = data['rechargeType']
    duration = int(data['duration'])
    contentId = data.get('contentId')
    via = data.get('via')

    if via == "android":
        uid = data.get('uid')
    else:
        
        uid = request.cookies.get('user_id')
        print(uid)

    if contentId is not None:
        contentId = int(contentId)#contentId convert into int
    
    print("requested data----------",data)
    
    payment_info = get_user_by_id(uid)#fetch user info for whom data will be stored
    if payment_info is None:
        return jsonify({"error": "user not found"}), 400
    elif isinstance(payment_info, Exception):
        return jsonify({"error": "internal server error"}), 500
    user_hash = payment_info['user_hash']#if user info found then  get user hash of the user to store for subscription details

    try:
        # Verify payment signature
        client.utility.verify_payment_signature({
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_order_id': razorpay_order_id,
            'razorpay_signature': razorpay_signature
        })
        result = client.payment.fetch(razorpay_payment_id)

        # Fetch payment method from Razorpay
        payment_method = {
            "method": result["method"],
            "details": None
        }

        if result['method'] == 'netbanking':
            payment_method["details"] = result["bank"]
        elif result['method'] == 'upi':
            payment_method["details"] = result["vpa"]
        elif result['method'] == 'card':
            payment_method["details"] = result["card_id"]
            
        #payment details table data
        payment_details = {
            "user_id": uid,
            "order_id": razorpay_order_id,
            "payment_id": razorpay_payment_id,
            "payment_status": "success",
            "final_amount": money,
            "discount": 0.0,
            "cupon_code": "max",
            "payment_method": payment_method
        }

        # If signature verification passes, mark payment as successful and save in database
        save_payment_details(payment_details)

        if recharge_type == 'subscription' or recharge_type=='razorpay direct payment':
            start_day = subscription_data_add_on(uid)
            end_day = 0
            s_id = None
            accesslevel = None #this object for access level of the content

            if duration == 1:#if the duration is for one day
                end_day =start_day+(100*365*24*60*60)
                s_id = 4
                accesslevel ={"access": contentId,"period":"unlimited"};
            elif duration == 30:#if the duration for the one month
                end_day = start_day + (30 * 24 * 60 * 60)
                s_id = 1
                accesslevel ={"access": "all","period":"one-month"}
            elif duration == 365:#if the duration is for one year
                end_day = start_day + (365 * 24 * 60 * 60)
                s_id = 5
                accesslevel ={"access": "all","period":"one-year"}
                
            #this data for the subscription details
            data = {
                "user_id": uid,
                "start_day": start_day,
                "end_day": end_day,
                "s_id": s_id,
                "content_details": accesslevel,
                "user_hash": user_hash,
                "order_id": razorpay_order_id
            }

            debug=save_user_subscription_details(data)
            if recharge_type=='subscription':
                return jsonify({"message": "Payment verified and details saved successfully"}),200
            else:
                return jsonify({"message":"razorpay direct payment for content"}),200
 
        
        # this portion is for wallet recharge
        wallet = Wallet.query.filter_by(user_id=uid).first()
        if recharge_type == 'wallet' and wallet is not None:
            #here the unique universal order id genarate for wallet recharge
            universal_number = int(time.time() * 1000)
            wallet_order_id='order_'+str(universal_number)
            
            if contentId is not None:
                price = 0
                article = get_article_by_id(contentId)
                if article is not None:
                    price = article['price']
                
                start_day = subscription_data_add_on(uid)
                end_day = 0
                s_id = None
                accesslevel = None

                if duration == 1:
                    end_day = int(time.time())+(100*365*24*60*60)
                    s_id = 4
                    accesslevel = {"access": contentId,"period":"unlimited"}
                    
                # this data is for storing user subscription for the content recharge from wallet at the time of wallet recharge
                data = {
                    "user_id": uid,
                    "start_day": start_day,
                    "end_day": end_day,
                    "s_id": s_id,
                    "content_details": accesslevel,
                    "user_hash": user_hash,
                    "order_id": wallet_order_id,
                    
                }
                #here we 
                money=round(Decimal(money),2)
                wallet.balance =wallet.balance+round(Decimal(str(money).rstrip('0').rstrip('.')))
                if wallet.balance >= price:
                    wallet.balance -= price
                    save_user_subscription_details(data)
                    payment_details = {
                        "user_id": uid,
                        "order_id":  wallet_order_id,
                        "payment_id": '',
                        "payment_status": "success",
                        "final_amount": price,
                        "discount": 0.0,
                        "cupon_code": "max",
                        "payment_method": {"method": 'wallet'}
                    }
                    # Wallet recharge and content price deduction will be stored in the payment details
                    save_payment_details(payment_details)
                    db.session.commit()
                    return jsonify({"message": "wallet recharge successful and content price deducted"})
                else:
                    db.session.commit()
                    return jsonify({"message":"Low wallet balance"}),200
            else:
                money=round(Decimal(money),2)
                wallet.balance =wallet.balance+round(Decimal(str(money).rstrip('0').rstrip('.')))
                db.session.commit()
                return jsonify({"message": "Wallet recharged successfully", "balance": wallet.balance}), 200
        else:
            new_wallet = Wallet(user_id=uid, balance=money)
            db.session.add(new_wallet)
            db.session.commit()
            return jsonify({"message": "Wallet created and recharged successfully", "balance": new_wallet.balance}), 200

        # return jsonify({"message": "Payment verified and details saved successfully"}), 200
    except razorpay.errors.SignatureVerificationError as e:
        # Handle signature verification failure
        print(f"Signature verification failed: {str(e)}")
        return jsonify({'error': 'Payment verification failed'}), 400
    except Exception as e:
        # Handle other unexpected errors
        print(f"Payment verification failed: {str(e)}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


# Nibbbbbbbbbbbbbbbbiii
@app.route('/verify_payment_epaper', methods=['POST'])
def verify_payment_epaper():
    data = request.json
    print(data)
    
    razorpay_payment_id = data['razorpay_payment_id']
    razorpay_order_id = data['razorpay_order_id']
    razorpay_signature = data['razorpay_signature']
    money = int(data['money'])
    uid = data.get('uid')
    duration = int(data['duration'])
    contentId = data.get('contentId')
    state_name = data.get('state')
    
    # Retrieve user information
    payment_info = get_user_by_id(uid)
    if payment_info is None:
        return jsonify({"error": "user not found"}), 400
    
    user_hash = payment_info['user_hash']
    first_name = payment_info['name']
    email = payment_info['email']
    mobile_no = payment_info['phone']
    

    try:
        # Verify payment signature
        client.utility.verify_payment_signature({
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_order_id': razorpay_order_id,
            'razorpay_signature': razorpay_signature
        })

        # Store payment details
        payment_details = {
            "user_id": uid,
            "order_id": razorpay_order_id,
            "payment_id": razorpay_payment_id,
            "payment_status": "success",
            "final_amount": money,
            "discount": 0.0,
            "cupon_code": "max",
            "payment_method": {"method": "razorpay"}
        }
        save_payment_details(payment_details)

        # Store subscription details for the specified duration
        start_day = epaper_subscription_data_add_on(uid)

        # Debugging: Check the type and value of start_day
        print(f"start_day: {start_day}, type: {type(start_day)}")

        # Ensure start_day is an integer
        if not isinstance(start_day, int):
            return jsonify({"error": "start_day is not an integer", "value": start_day}), 500

        # Calculate end_day
        end_day = start_day + (duration * 24 * 60 * 60)  # duration in days, converted to seconds
        
        # Debugging: Check the type and value of end_day
        print(f"end_day: {end_day}, type: {type(end_day)}")

        accesslevel = {"access": contentId, "period": "one-day"}

        subscription_details = {
            "order_id": razorpay_order_id,
            "email": email,
            "start_date": start_day,
            "end_date": end_day,
            "first_name": first_name,
            "mobileNo": mobile_no,
            "state_name": state_name,
            "user_hash": user_hash,
            "content_details": accesslevel,
            "user_id": uid
        }
        result = save_epaper_subscription_details(subscription_details)
        print(f"Debug info from save_epaper_subscription_details: {result}")

        if result["status"] == "success":
            return jsonify({"message": "Payment verified and subscription details saved successfully"}), 200
        else:
            return jsonify({"error": "Failed to save subscription details", "message": result["error"]}), 500
    except razorpay.errors.SignatureVerificationError as e:
        # Handle signature verification failure
        print(f"Signature verification failed: {str(e)}")
        return jsonify({'error': 'Payment verification failed'}), 400
    except Exception as e:
        # Handle other unexpected errors
        print(f"Payment verification failed: {str(e)}")
        return jsonify({'error': 'Internal server error1', 'message': str(e)}), 500


@app.route('/get_all_articles', methods=['GET'])
def get_articles():
    response = get_all_articles()
    return response

@app.route('/article/<int:id>', methods=['GET'])
def get_article(id):
    article = get_article_by_id(id)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    return jsonify(article)

@app.route('/get_subscriber_by_id', methods=['POST'])
def get_subscriber_by_id():
    data=request.json
    user_id=data['user_id']
    response = subscriber_by_id(user_id)
    return response

@app.route('/get_article_cost_by_id', methods=['POST'])
def get_articleCost_by_id():
    data = request.json
    id = data['id']
    response = articleCost_by_id(id)
    return response



@app.route('/wallet/<int:user_id>', methods=['GET'])
def get_wallet_balance(user_id):
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if wallet:
        return jsonify({'balance': wallet.balance})
    return jsonify({'balance': 0}), 404

@app.route('/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id):
    #print(user_id)
    #user_id= request.cookies.get("user_id")
    transactions = payment_details.query.filter_by(user_id=user_id).all()
    print(transactions)
    return jsonify([{
        'id': transaction.id,
        'payment_id': transaction.payment_id,
        'amount': transaction.final_amount,
        'payment_status':transaction.payment_status,
        'payment_time': transaction.start_day,
        'payment_method':transaction.payment_method
        
    } for transaction in transactions])

# @app.route('/pay_article', methods=['POST'])
# def pay_article():
#     data = request.json
#     uid=data['uid']
#     print(uid)
#     payment_info=get_user_by_id(uid)
#     if payment_info==None:
#         return  jsonify({'status': 'failed'}),400
#     elif isinstance(payment_info,Exception):
#         return jsonify({'status': 'success'}),500
#     user_hash=payment_info['user_hash']

#     new_user_subscription = USER_SUBSCRIPTION(
#         user_id = data['uid'],
#         start_day = int(time.time()),
#         end_day = int(time.time())+(5*60),
#         s_id = 4,
#         content_detatils=json.dumps({"access":data['contentId']}),
#         user_hash=user_hash
#     )
#     db.session.add(new_user_subscription)
#     #wallet 
#     # wallet = Wallet.query.filter_by(user_id=user_id).first()
#     content = Articles.query.filter_by(id=data['contentId']).first()
#     if not content:
#         return jsonify({'status': 'failure', 'message': 'Article not found'}), 404
#     wallet = Wallet.query.filter_by(user_id=data['uid']).first()
#     if wallet and wallet.balance >= content.price:
#         wallet.balance -= content.price
#         db.session.commit()


#     db.session.commit()

#     return jsonify({'status': 'success'})
#     # return jsonify({'status': 'failure', 'message': 'Insufficient balance'}), 400

# @app.route('/pay_article', methods=['POST'])
# def pay_article():
#     data = request.json
#     uid=data['uid']
#     print(uid)
#     payment_info=get_user_by_id(uid)
#     if payment_info==None:
#         return  jsonify({'status': 'failed'}),400
#     elif isinstance(payment_info,Exception):
#         return jsonify({'status': 'success'}),500
#     user_hash=payment_info['user_hash']

#     new_user_subscription = USER_SUBSCRIPTION(
#         user_id = data['uid'],
#         start_day = int(time.time()),
#         end_day = int(time.time())+(5*60),
#         s_id = 4,
#         content_detatils=json.dumps({"access":data['contentId']}),
#         user_hash=user_hash
#     )
#     db.session.add(new_user_subscription)
#     #wallet 
#     # wallet = Wallet.query.filter_by(user_id=user_id).first()
#     content = Articles.query.filter_by(id=data['contentId']).first()
#     if not content:
#         return jsonify({'status': 'failure', 'message': 'Article not found'}), 404
#     wallet = Wallet.query.filter_by(user_id=data['uid']).first()
#     if wallet and wallet.balance >= content.price:
#         wallet.balance -= content.price
#         payment_details={
#         "user_id":uid,
#         "order_id":'',
#         "payment_id":'',
#         "payment_status":"success",
#         "final_amount":content.price,
#         "discount":0.0,
#         "cupon_code":"max",
#         "payment_method":{"method":'wallet'},
#         }
#         save_payment_details(payment_details)
        


#     db.session.commit()

#     return jsonify({'status': 'success'})

@app.route('/pay_article', methods=['POST'])
def pay_article():
    data = request.json
    # price=data['money']
    uid=data['uid']
    print(uid)
    payment_info=get_user_by_id(uid)
    if payment_info==None:
        return  jsonify({'status': 'failed'}),400
    elif isinstance(payment_info,Exception):
        return jsonify({'status': 'success'}),500
    user_hash=payment_info['user_hash']
    #new order_id for wallet
    universal_number = int(time.time() * 1000)
    wallet_order_id='order_'+str(universal_number)
    print("hiiiiii")

    new_user_subscription = USER_SUBSCRIPTION(
        user_id = data['uid'],
        start_day = int(time.time()),
        end_day = int(time.time())+(100*365*24*60*60),
        s_id = 4,
        content_details={"access":data['contentId'],"period":"unlimited"},
        user_hash=user_hash,
        order_id=wallet_order_id
      
        
    )
    db.session.add(new_user_subscription)
    #wallet 
    # wallet = Wallet.query.filter_by(user_id=user_id).first()
    content = Articles.query.filter_by(id=data['contentId']).first()
    if not content:
        return jsonify({'status': 'failure', 'message': 'Article not found'}), 404
    wallet = Wallet.query.filter_by(user_id=data['uid']).first()
    if wallet and wallet.balance >= content.price:
        wallet.balance -= content.price
        payment_details={
        "user_id":uid,
        "order_id":wallet_order_id,
        "payment_id":'',
        "payment_status":"success",
        "final_amount":content.price,
        "discount":0.0,
        "cupon_code":"max",
        "payment_method":{"method":'wallet'},
        }
        save_payment_details(payment_details)
        


    db.session.commit()

    return jsonify({'status': 'success'}),200

#MAITY

# @app.route('/check-email', methods=['POST'])
# def check_email():
#     data = request.get_json()
#     email = data.get('email')
 
#     if not email:
#         return jsonify({"message": "Email is required"}), 400

#     user = USER.query.filter_by(email=email).first()
#     if user:
#         print(f"User found: {user}")

#         subscription = E_Paper.query.filter_by(user_id=user.id).first()
#         if subscription:
#             if is_subscription_valid(subscription.start_day, subscription.end_day):
#                 return jsonify({"redirect": "contents"}), 200
#             else:
#                 return jsonify({"redirect": "subscription"}), 200
#         else:
#             return jsonify({"redirect": "subscription"}), 200
#     else:
#         return jsonify({"message": "User not found"}), 404

# @app.route('/check-email', methods=['POST'])
# def check_email():
#     data = request.get_json()
#     print('1............................................................................')
#     print(data)
#     email = data.get('email')
#     print('2............................................................................')
#     print(email)

#     if not email:
#         print('3............................................................................')
#         return jsonify({"message": "Email is required"}), 400

#     user = USER.query.filter_by(email=email).first()
#     print('4............................................................................')
#     print(user)
#     if user:
#         print('5............................................................................')
#         subscription = EPaper_Subscription.query.filter_by(email=email).first()
#         print(subscription)
#         if subscription:
#             print('6............................................................................')
#             if is_subscription_valid(subscription.start_date, subscription.end_date):
#                 print('7............................................................................')
#                 return jsonify({"redirect": "contents"}), 200
#             else:
#                 print('8............................................................................')
#                 return jsonify({"redirect": "subscription"}), 200
#         else:
#             print('9............................................................................')
#             return jsonify({"redirect": "subscription"}), 200
#     else:
#         print('10............................................................................')
#         subscription = EPaper_Subscription.query.filter_by(email=email).first()
#         print(subscription)
#         if subscription:
#             print('11............................................................................')
#             if is_subscription_valid(subscription.start_date, subscription.end_date):
#                 print('12............................................................................')
#                 return jsonify({"redirect": "contents"}), 200
#             else:
#                 print('13............................................................................')
#                 return jsonify({"redirect": "subscription"}), 200
#         else:
#             print('14............................................................................')
#             return jsonify({"message": "User not found, but email is present in EPaper_Subscription", "trigger_auth": True}), 404

@app.route('/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = USER.query.filter_by(email=email).first()
    if user:
        # subscription = EPaper_Subscription.query.all()
        subscription = EPaper_Subscription.query.filter_by(email=email).first()
        if subscription:
            if is_subscription_valid(subscription.start_date, subscription.end_date):
                return jsonify({"redirect": "epaper"}), 200
            else:
                return jsonify({"redirect": "epaperSubscription"}), 200
        else:
            return jsonify({"redirect": "epaperSubscription"}), 200
    else:
        subscription = EPaper_Subscription.query.filter_by(email=email).first()
        if subscription:
            if is_subscription_valid(subscription.start_date, subscription.end_date):
                return jsonify({"redirect": "epaper"}), 200
            else:
                return jsonify({"redirect": "epaperSubscription"}), 200
        else:
            return jsonify({"message": "User not found, but email is present in EPaper_Subscription", "trigger_auth": True}), 404

# @app.route('/check-email', methods=['POST'])
# def check_email():
#     data = request.get_json()
#     email = data.get('email')

#     if not email:
#         return jsonify({"message": "Email is required"}), 400

#     user = USER.query.filter_by(email=email).first()

#     def is_subscription_valid(start_date_epoch, end_date_epoch):
#         current_epoch_time = int(time.time())  # Get current time in epoch
#         return start_date_epoch <= current_epoch_time <= end_date_epoch

#     if user:
#         subscription = EPaper_Subscription.query.filter_by(email=email).first()
#         if subscription:
#             if is_subscription_valid(subscription.start_date, subscription.end_date):
#                 return jsonify({"redirect": "contents"}), 200
#             else:
#                 return jsonify({"redirect": "subscription"}), 200
#         else:
#             return jsonify({"redirect": "subscription"}), 200
#     else:
#         subscription = EPaper_Subscription.query.filter_by(email=email).first()
#         if subscription:
#             if is_subscription_valid(subscription.start_date, subscription.end_date):
#                 return jsonify({"redirect": "contents"}), 200
#             else:
#                 return jsonify({"redirect": "subscription"}), 200
#         else:
#             return jsonify({"message": "User not found, but email is present in EPaper_Subscription", "trigger_auth": True}), 404

@app.route("/reset-sessions", methods=["GET"])
def reset_session():
    response, status_code = reset_active_session()
    return response, status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
