export class Product {
  id: string;
  name: string;
  price: string;
  photo: string;
  category: string;
  items: string[];
  createdOn: Date;
  inStock: string;
  stock: Boolean;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.name = obj.name;
    this.price = obj.price;
    this.photo = obj.photo;
    this.createdOn = obj.createdOn;
    this.category = obj.category;
    this.inStock = obj.inStock;
    this.items = [];

    if(this.inStock == 'yes') {
      this.stock = true
    } else {
      this.stock = false
    }

    if (obj.items && obj.items.length) {
      for (const item of obj.items) {
        this.items.push(item);
      }
    }
  }
}
