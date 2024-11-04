# Architecture
## MVC pattern
    -Model
        --data mapping
        --data store
        --definition of data
    -View
        -presentation/ "frontend haru"
    -Controller
        -9.8 m/s2 db entry  - defines the unit  , view shoes Acc due to gravity => 9.8m/s2

## SErver 
  - client server Architecture
   client ----> server
   Request Generator =====> Responder 
   Request
   URL
   protocol      http   https
   domain.tld    80     443
   portno
   path          /path/path
   query        /path?querystring
   method       POST GET PUT PATCH DELETE
                CRUD operation 
END point ===> Data
    => json data -> api
    => XML data/html => view

method
protocol : // host.tld:portno/path/..../?queryString....

## Ecommerce Project
-> login 
-> Add to cart
-> Payment
-> Search 
-> product status 
-similar product feture 
-> category
->

a. authentication and authorization 
    - login 
    - sign up 
    - activation
    - forget password
    - logout 
    - dashboard
    - RBAC
b. Product
    -crud
    -product list
        -search
        -category
        - brand 
        - Add to cart
        - Wish list
        - Order

c. category 
 -crude
 -category list 
 -category details ( product list - category ) 

d. brand 
     - CRUD 
     - BRAND LIST 
     - BRAND DETAIL
     - BRAND(PRODUCT LIST - BRAND )





e. payment gateway
    -cod
    -
f. Review and Rating
    -
g. Offers and Coupons 
h. logistics

## crud operation
-> Methods 
C = create -> post method 
R = read => get method 
U = update => put / patch
D = delete => delete method


## Auth and Authorization model

=> REGISTER 
    -> Data entry => Form (react view )
    -> Submit 
        --> BE / api caller

=> login 
    -> login view (FOrm login , react)
    -> data entry (form action,react)
    -> api call (be call)



## content

// user 
 => create
 => post -> /user = > body data => register body
 => read 
    =>get => /user => list all users
        -> ?filter
    => get => /user/:id => get detailsof  a user
    => update 
        => put/patch => /user/:id => update request
=> delete 
    -> delete => /user/:id => delete operation 


###### npm install multer to manage multipart data;;;;;;


###### joi , zod , yup , ajv are well known  validators 
### for backend joi 
## FOR REACT FRONT YUP 


## install bcrypt
## mongodb community server 
           shell
        
           mongodb compasss 



host => localhost , 127.0.0.1
port => 27017
user =>  api-29
pass => NA  recoverymongodb


a. insert 
=> <Activedb> . <collection / tableName>.insertOne(<valid json object>)
=> <Activedb> . <collection / tableName>.insertMany(<valid json object>)

b. find select 
=> <activedb>.<collection/table>.find(filter,project)
=> <activedb>.<collection/table>.find({},name = 1 , email = 1 , id = 0)
filter => 
{
    key : value,
    key :value....
}
=> ~ SELECT * FROM table WHERE key = value AND key = value 

{
    $ operation : [] or {}
}

{
    $or: [{key:value},{key2:value}]
}

~ WHERE (key1=value or key2 = value )

{
    $or : [],
    $or : [],
}
{
    $and :[
        {$or:[]}
    ]
}

 {
    key:{
        $gt:value 
    }
 }

 $gt , $gte , $lt , $eq ,  $ne , $in , $nin,

 users => age 
 db.users.find({age: {$gt:18}})

 db.users.updateOne({_id : ObjectId('6666677777777f54'),{$set :{email:"xyz@gmail.com"}}});
 db.users.updateMany({_id : ObjectId('6666677777777f54'),{$set :{email:"xyz@gmail.com"}},{upsert:1}});

 delete: 
 db.users.deleteOne({_id: ObjectId('##############)})
 db.users.deleteMany({_id: ObjectId('##############)})
 ## with no filter(null object) it will delete everything 


mongo as a db server ---  
 -- core development 
 -- orm / odm implementation

 MVC 
 M -> model

 collection / table 
    table name plural 
    model name singular 
    for eg
    users => table name 
    user = > User model 


    {key : value }

    collection keys or table ko column 

    these are the properties of a model 
    User model => userObj() => keys

    Every object of a model class is a row/document of a table / collection 



db architect 
:: draw.io or app.diagrams.net 
:: dbdiagram.io
    

    ER 
    Ecommerce 
    users 
    products 
    banner
    brand 
    wishlist 
    cart
    
# node 
default core integration 
fetch package 
axios package
    - promise based 
    -get post put patch delete
    -interceptors

XMLHttpRequest (xhr)