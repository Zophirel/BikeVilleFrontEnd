export  class SignUpData {
    title: string = '';
    firstName: string = '';
    middleName: string = ''; 
    lastName: string = '';
    email: string = '';
    password: string = '';
    
    constructor(title: string, name: string, middle: string, surname: string, email: string, password: string) {
        this.title = title; 
        this.firstName = name;
        this.middleName = middle;
        this.lastName = surname;
        this.email = email;
        this.password = password;
    }
}