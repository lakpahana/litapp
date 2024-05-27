# Description.
#
# + userId - field description  
# + userName - field description  
# + email - field description  
# + firstName - field description  
# + lastName - field description
public type UserSave record {|
    int userId;
    string userName;
    string email;
    string firstName;
    string lastName;
|};

# Description.
#
# + userSave - field description
public type UserSaveRequest record {|
    UserSave userSave;
|};
