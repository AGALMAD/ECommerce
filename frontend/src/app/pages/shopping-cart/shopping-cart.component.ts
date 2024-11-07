import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { OrdinationDirection } from '../../models/enums/ordination-direction';
import { OrdinationType } from '../../models/enums/ordination-type';
import { ProductType } from '../../models/enums/product-type';
import { QuerySelector } from '../../models/query-selector';
import { ProductService } from '../../services/product.service';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CartContent } from '../../models/cart-content';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  /*numOfTotalProducts = 0;
  totalPrice = 0.0;
  totalProducts : Product[] = []
  numOfIndividualProduct = 0*/

  shoppingCartProducts: Product[] = []
  allProducts: Product[] | null | undefined = []
  querySelector: QuerySelector;

  // Estos servicios son para pruebas
  constructor(private productService: ProductService, private apiService: ApiService) {
    const FIRST_PAGE = 1;
    const PRODUCT_PER_PAGE = 5;
    //QuerySelector por defecto para pruebas
    this.querySelector = new QuerySelector(ProductType.FRUITS, OrdinationType.NAME, OrdinationDirection.ASC, PRODUCT_PER_PAGE, FIRST_PAGE, "");
  }

  async ngOnInit(): Promise<void> {
    this.getShoppingCart();
    this.getAllProducts();
  }

  async getShoppingCart() {
    if (this.apiService.jwt == "") {
      const productsRaw = localStorage.getItem("shoppingCart")
      if (productsRaw) this.shoppingCartProducts = JSON.parse(productsRaw)
    }
    else {
      // Si ha iniciado sesión, hago la petición y borro el carrito ya existente
      localStorage.removeItem("shoppingCart")
      const result = await this.apiService.get("ShoppingCart", {}, 'json')
      if(result.data)
      {
        const data : any = result.data
        this.shoppingCartProducts = data.cartContent
      }
      console.log("CARRITO: ", result)
    }
  }

  async getAllProducts() {
    const result = await this.productService.getAllProducts(this.querySelector);
    this.allProducts = result?.products;
  }

  getTotal(productName: string): number {
    // WARNING: Porrito bastísimo xD
    // Suma las cantidades de los productos con el mismo nommbre
    const totalQuantity = this.shoppingCartProducts
      .filter(product => product.name === productName)
      .reduce((total, product) => total + product.total, 0);

    return totalQuantity;
  }

  async addProductToCart(product: Product) {
    const existingProduct = this.shoppingCartProducts.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.total += 1;
    } else {
      const productWithQuantity = { ...product, total: 1 };
      this.shoppingCartProducts.push(productWithQuantity);
    }

    if (this.apiService.jwt == "")
    {
      localStorage.setItem("shoppingCart", JSON.stringify(this.shoppingCartProducts));
    }
    else
    {
      localStorage.removeItem("shoppingCart")
      const cartContent = new CartContent(this.getTotal(product.name), product.id)
      await this.apiService.post("ShoppingCart", cartContent)
      this.getShoppingCart()
    }
  }

  deleteProduct(productId: number) {
    const index = this.shoppingCartProducts.findIndex(product => product.id === productId);

    if (index !== -1) {
      const product = this.shoppingCartProducts[index];

      if (product.total > 1) {
        product.total -= 1;
      } else {
        this.shoppingCartProducts.splice(index, 1);
      }

      if (this.apiService.jwt == "") {
        localStorage.setItem("shoppingCart", JSON.stringify(this.shoppingCartProducts));
      }
      else {

      }
    }
  }

  pay()
  {
  }

}
