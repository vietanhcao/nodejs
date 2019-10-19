const products: any[] = [];

export class Product {
  title: string
  constructor(title : any){
    this.title = title;
  }

  save(){
    products.push(this);
  }

  static fetchAll(){
    return products;
  }
}