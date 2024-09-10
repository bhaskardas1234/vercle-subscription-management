from settings import *

class payment_details(db.Model):
    __tablename__="payment_details"
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer)
    start_day=db.Column(db.DateTime, default=datetime.now)
    order_id=db.Column(db.String,nullable=False)
    payment_id=db.Column(db.String,nullable=False)
    payment_status=db.Column(db.String,nullable=False)
    final_amount=db.Column(db.Numeric(precision=10, scale=2),nullable=False)
    discount=db.Column(db.Numeric(precision=10, scale=2),nullable=False,default=0.0)
    cupon_code=db.Column(db.String,nullable=True)
    payment_method=db.Column(db.JSON)
    def __init__(self,user_id,order_id,payment_id,payemnt_status,final_amount,discount,cupon_code,payment_method):
        self.user_id=user_id
        self.order_id=order_id
        self.payment_id=payment_id
        self.payment_status=payemnt_status
        self.final_amount=final_amount
        self.discount=discount
        self.cupon_code=cupon_code
        self.payment_method=payment_method
    def get_payment_info(self):
        return{
            "id":self.id,
            "user_id":self.user_id,
            "order_id":self.order_id,
            "payment_id":self.payment_id,
            "payment_status":self.payment_status,
            "final_amount":self.final_amount,
            "discount":self.discount,
            "cupon_code":self.cupon_code,
            "payment_method":self.payment_method
            }

def get_current_epoch():
    return int(time.time())

class USER(db.Model):
    __tablename__="MBI_USER_INFO_V3"
    id=db.Column(db.Integer,primary_key=True,autoincrement = True)
    name=db.Column(db.TEXT)
    email=db.Column(db.TEXT)
    phone_number=db.Column(db.TEXT)
    dob=db.Column(db.TEXT)
    gender=db.Column(db.TEXT)
    token=db.Column(db.TEXT)
    sessions=db.Column(db.JSON)
    active_sessions=db.Column(db.JSON)
    created_at=db.Column(db.Integer, default=get_current_epoch)
    last_login=db.Column(db.Integer, default=get_current_epoch)
    user_hash=db.Column(db.TEXT) 
    identity=db.Column(db.TEXT)
    notes=db.Column(db.JSON)
    status=db.Column(db.TEXT, default="ACTIVE")

    def __init__(self,name,email,phone_number, dob, gender, token,sessions,active_sessions, identity):
        self.name=name
        self.email=email
        self.phone_number=phone_number
        self.dob = dob
        self.gender = gender
        self.token=token
        self.sessions=sessions
        self.active_sessions=active_sessions
        self.identity = identity
        
    def get_user_info(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone_number,
            "dob": self.dob,
            "gender": self.gender,
            "created_at": self.created_at,
            "last_login": self.last_login,
            "timestamp": datetime.now(),
            "user_hash":self.user_hash,
            "identity": self.identity
        }

    def get_user_info_by_admin(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone_number,
            "identity": self.identity,
            "dob": self.dob,
            "gender": self.gender,
            "created_at": self.created_at,
            "last_login": self.last_login,
            "identity": self.identity,
            "location": self.sessions[0]["network_info"]["ipLocation"]["city"]["name"]
        }

class USER_SUBSCRIPTION(db.Model):
    __tablename__="user_subscription"
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer)
    start_day=db.Column(db.BigInteger)#change 
    end_day=db.Column(db.BigInteger)#change
    s_id=db.Column(db.Integer)
    content_details = db.Column(db.JSON)
    user_hash=db.Column(db.TEXT) 
    # newww
    order_id=db.Column(db.TEXT)
    
    def __init__(self,user_id,start_day,end_day,s_id,content_details,user_hash,order_id):
        self.user_id=user_id
        self.start_day=start_day
        self.end_day=end_day
        self.s_id=s_id
        self.content_details=content_details
        self.user_hash=user_hash
        self.order_id=order_id
        
    def user_subscription_info(self):
        return {
            "id":self.id,
            "user_id":self.user_id,
            "start_day":self.start_day,
            "end_day":self.end_day,
            "s_id":self.s_id,
            "content_details":self.content_details,
            "user_hash": self.user_hash
        }

class SUBSCRIPTION(db.Model):

    __tablename__="subscription"
    id=db.Column(db.Integer,primary_key=True)
    duration=db.Column(db.String)
    price=db.Column(db.Integer)
    subscription_type=db.Column(db.Integer)
    def __init__(self,duration,price,subscription_type):
        self.duration=duration
        self.price=price
        self.subscription_type=subscription_type
    
    def subscription_info(self):
        return{
            "id":self.id,
            "duration":self.duration,
            "price": self.price,
            "subscription_type":self.subscription_type
             }
    
class Articles(db.Model):
    __tablename__="ARTICLES"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(precision=10, scale=2))

    def __init__(self, title, content, price):
        self.title = title
        self.content = content
        self.price = price

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "price": self.price
        }
    
# class Payment(db.Model):
#     __tablename__="payment"
#     id = db.Column(db.Integer, primary_key=True)
#     order_id = db.Column(db.String(50), unique=True, nullable=False)
#     payment_id = db.Column(db.String(50), nullable=True)
#     status = db.Column(db.String(20), nullable=False)

#     def __init__(self, order_id, payment_id, status):
#         self.order_id = order_id
#         self.payment_id = payment_id
#         self.status = status

class Wallet(db.Model):
    wallet_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    balance = db.Column(db.Numeric(precision=10, scale=2))

    def __init__(self, user_id, balance):
        self.user_id = user_id
        self.balance = balance

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.String(100))
    amount = db.Column(db.Float)
    payment_method = db.Column(db.String(50))
    payment_time = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer)

    def __init__(self, payment_id, amount, payment_method, user_id):
        self.payment_id = payment_id
        self.amount = amount
        self.payment_method = payment_method
        self.user_id = user_id

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.String(100))
    order_id = db.Column(db.String(100))
    user_id = db.Column(db.Integer)
    payment_methods = db.Column(db.JSON)
    amount = db.Column(db.Float)
    time = db.Column(db.DateTime)
    status = db.Column(db.String(50))

    def __init__(self, payment_id, order_id, user_id, payment_methods, amount, time, status):
        self.payment_id = payment_id
        self.order_id = order_id
        self.user_id = user_id
        self.payment_methods = payment_methods
        self.amount = amount
        self.time = time
        self.status = status

class Article(db.Model):
    article_id = db.Column(db.Integer, primary_key=True)
    article_name = db.Column(db.String(100))
    article_amount = db.Column(db.Float)

# class E_Paper(db.Model):
#     id=db.Column(db.Integer,primary_key=True)
#     user_id=db.Column(db.Integer)
#     # email=db.Column(db.String(50))
#     start_day=db.Column(db.Integer)
#     end_day=db.Column(db.Integer)
#     s_id=db.Column(db.Integer)
#     content_details = db.Column(JSONB)
#     user_hash=db.Column(db.TEXT)

#     def __init__(self,user_id,start_day,end_day,s_id,content_details,user_hash):
#         self.user_id=user_id
#         self.start_day=start_day
#         self.end_day=end_day
#         self.s_id=s_id
#         self.content_details=content_details
#         self.user_hash=user_hash

# class EPaper_Subscription(db.Model):

#     __tablename__="epaper_subscription"
#     id=db.Column(db.Integer,primary_key=True)
#     order_id=db.Column(db.TEXT)
#     email=db.Column(db.TEXT)
#     start_date=db.Column(db.Integer)
#     end_date=db.Column(db.Integer)
#     first_name=db.Column(db.TEXT)
#     mobileNo=db.Column(db.String(50),nullable=False)#phonenumber
#     state_name=db.Column(db.TEXT) 

#     def __init__(self,orderid,email,start_date,end_date,first_name,mobileNo,state_name):
#         self.order_id=orderid
#         self.email=email
#         self.start_date=start_date
#         self.end_date=end_date
#         self.first_name=first_name
#         self.mobileNo=mobileNo
#         self.state_name=state_name



# Nibiiiiiiiiiiiiiiiiiiiiiiiiiiiii

class EPaper_Subscription(db.Model):

    __tablename__="epaper_subscription"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id=db.Column(db.TEXT)
    email=db.Column(db.String(50))
    user_id=db.Column(db.Integer)
    start_date=db.Column(db.Integer)
    end_date=db.Column(db.Integer)
    first_name=db.Column(db.TEXT)
    mobileNo=db.Column(db.String(50),nullable=False)#phonenumber
    state_name=db.Column(db.TEXT)
    content_details = db.Column(db.JSON)
    user_hash=db.Column(db.TEXT)

  

    def __init__(self,order_id,email,start_date,end_date,first_name,mobileNo,state_name,user_id,content_details,user_hash):
        self.order_id=order_id
        self.email=email
        self.start_date=start_date
        self.end_date=end_date
        self.first_name=first_name
        self.mobileNo=mobileNo
        self.state_name=state_name
        self.content_details=content_details
        self.user_hash=user_hash
        self.user_id=user_id


    def user_subscription_info(self):
      return {
        "id": self.id,
        "user_id": self.user_id,
        "start_date": self.start_date,
        "end_date": self.end_date,
        "first_name": self.first_name,
        "mobileNo": self.mobileNo,
        "state_name": self.state_name,
        "content_details": self.content_details,
        "user_hash": self.user_hash,
        "order_id": self.order_id
      }