export class Query {
  id: string;
  name: string;
  email: string;
  phone: number;
  createdOn: Date;
  address: string;
  message: string;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.name = obj.name;
    this.address = obj.address;
    this.message = obj.message;
    this.createdOn = obj.createdOn;
    this.email = obj.email;
    this.phone = obj.phone;
  }
}
