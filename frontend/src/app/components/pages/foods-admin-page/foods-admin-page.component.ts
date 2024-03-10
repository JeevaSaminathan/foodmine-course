import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-foods-admin-page',
  templateUrl: './foods-admin-page.component.html',
  styleUrls: ['./foods-admin-page.component.css']
})
export class FoodsAdminPageComponent {

  foods:Food[] = [];
  constructor(private toastrService:ToastrService,
    private foodService:FoodService,
    private router:Router, 
    activatedRoute:ActivatedRoute) {
    let foodObservable:Observable<Food[]>;
    foodObservable = foodService.getFoods();
    
    foodObservable.subscribe(food => {
      this.foods = food;
    })
   }


   removeFoodFromFoods(food:Food){
    const confirmation = window.confirm(`Are you sure you want to remove ${food.name}?`);
    if(confirmation){
      this.foodService.deleteFood(food.id).subscribe({
        next:() => {
          this.toastrService.success(`Food Deleted Successfully`);
          this.router.navigateByUrl('/');
        },
        error:(errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Food');
        }
     });
    }
  }

  editFoodFromFoods(food:Food){
    this.router.navigate(['/editfoods'], { queryParams: { id: food.id } });
  }

}
