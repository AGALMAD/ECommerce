import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Subscription, catchError, forkJoin, lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductType } from '../../models/enums/product-type';
import { OrdinationType } from '../../models/enums/ordination-type';
import { OrdinationDirection } from '../../models/enums/ordination-direction';
import { QuerySelector } from '../../models/query-selector';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [HeaderComponent, SearchBarComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  allProducts: Product[] | null = [];
  filteredProducts: Product[] = [];
  routeParamMap$: Subscription | null = null;

  querySelector: QuerySelector;
  productTypeString: string = "Producto";


  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {
    const FIRST_PAGE = 1;
    const PRODUCT_PER_PAGE = 4;
    //QuerySelector por defecto para pruebas
    this.querySelector = new QuerySelector(ProductType.FRUITS, OrdinationType.NAME, OrdinationDirection.ASC, 1, PRODUCT_PER_PAGE, FIRST_PAGE);
  }

  async ngOnInit(): Promise<void> {

    this.getAllProducts()

  }



  getAllProducts() {

    this.routeParamMap$ = this.activatedRoute.paramMap.subscribe(async paramMap => {
      const category = paramMap.get('category') as unknown as string;
      switch (category) {
        case "frutas":
          this.querySelector.productType = ProductType.FRUITS;
          const fruits = await this.productService.getAllProducts(this.querySelector);
          console.log("fruits", fruits)
          this.allProducts = fruits.data;
          console.log(this.allProducts);
          break;
        case "verduras":
          this.querySelector.productType = ProductType.VEGETABLES;
          const vegatables = await this.productService.getAllProducts(this.querySelector);
          this.allProducts = vegatables.data
          break;
        case "carnes":
          this.querySelector.productType = ProductType.MEAT;
          const meats = await this.productService.getAllProducts(this.querySelector);
          this.allProducts = meats.data
          break;
      }
    });


    this.productTypeString = this.querySelector.productType.toString();


    console.log("All products ", this.allProducts);
  }



  nextPage() {

    this.querySelector.actualPage += 1;

    const currentPageElement = document.getElementById("pagination-numbers");

    if (currentPageElement) {

      currentPageElement.innerText = this.querySelector.actualPage.toString(); // Actualizar el texto en el DOM
    }

    this.getAllProducts();
  }




  previousPage() {
    this.querySelector.actualPage -= 1;

    const currentPageElement = document.getElementById("pagination-numbers");

    if (currentPageElement) {

      currentPageElement.innerText = this.querySelector.actualPage.toString(); // Actualizar el texto en el DOM
    }

    this.getAllProducts();
  }


  newNumberOfProducts() {
    // Obtener el elemento del DOM
    const productsPerPageElement = document.getElementById("products-per-page") as HTMLInputElement | HTMLSelectElement;

    // Asegurarnos de que el elemento existe y es del tipo correcto
    if (productsPerPageElement) {
      // Obtener el valor del input o select, y convertirlo a un número
      const numberOfProducts = parseInt(productsPerPageElement.value, 10);
      this.querySelector.productPageSize = numberOfProducts;
      this.getAllProducts();

    }



  }

 





  getSearchedProducts(products: Product[] | null) {
    this.allProducts = products;
  }

  /*async getProducts() {
    const request = await this.productService.getAllProducts();

    if (request.success) {
      this.allProducts = request.data;
    }

    console.log(this.allProducts); //para pruebas
  }*/

  ngOnDestroy(): void {
    this.routeParamMap$?.unsubscribe();
  }
}
