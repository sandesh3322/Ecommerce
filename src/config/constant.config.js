const FileFilterType ={
    IMAGE : 'image',
    VIDEO :'video',
    DOCUMENT:'document',
    AUDIO : 'audio'
}

const UserRoles ={
    ADMIN :"admin",
    CUSTOMER: "customer",
    SELLER : "seller"
}
const StatusType={
    ACTIVE :"active",
    INACTIVE: "inactive",
}
const CartStatus={
    
        NEW :"new",
        PENDING :"pending",
        ORDERED : "ordered",
        CANCELLED :"cancelled",
    //    COMPLETED: 'paid'
    
  }
  

module.exports ={
    FileFilterType ,
    UserRoles,
    StatusType,
    CartStatus

}