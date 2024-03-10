import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import { CheckboxDialogComponent } from '../../partials/checkbox-dialog/checkbox-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-foods-page',
  templateUrl: './edit-foods-page.component.html',
  styleUrls: ['./edit-foods-page.component.css']
})
export class EditFoodsPageComponent implements OnInit {
  food:Food = new Food();
  foodsForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '';
  imageUrl!: string;
  tags!:any;
  origins!:string[];
  favorite!:boolean;
  price!:number;
  stars!:number;
  cookingtime!:string;
  options = ['Option 1', 'Option 2', 'Option 3'];
  selectedOptions: { [key: string]: boolean } = {};
  textareaContentTags: string = '';
  textareaContentOrigins: string = '';
  tagsvalue!: string;
  originsvalue!: string;
  isDialogOpen: boolean = false;
  editfood!:Food;
  foodId!:string;
  inputValue: string = '';
  @ViewChild('myTextareatags')
  myTextareatags!: ElementRef;
  @ViewChild('myTextareaorigins')
  myTextareaorigins!: ElementRef;
  constructor(private formBuilder:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService,
    private foodService:FoodService,
    private router:Router,
    public dialog: MatDialog) { }

  ngOnInit(): void{
    this.foodsForm = this.formBuilder.group({
      favorite:['']
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

    this.activatedRoute.queryParams.subscribe(params => {
      this.foodId = params['id'];
    });

    let foodObservable:Observable<Food>;
    foodObservable = this.foodService.getFoodById(this.foodId);
    
    foodObservable.subscribe(food => {
      this.editfood = food;
      this.food = this.editfood;
      this.imageUrl=this.editfood.imageUrl;
      this.favorite = this.editfood.favorite;
    })
    
  }

  get fc(){
    return this.foodsForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.foodsForm.invalid){
      this.toastrService.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }

    if(this.textareaContentTags == ""){
      this.tags = this.editfood.tags;
    }
    else{
      this.tags = this.textareaContentTags.split('\n').map((line: string) => line.trim());
    }
    

    if(this.foodsForm.get('favorite')!.value == ""){
      this.favorite = this.editfood.favorite;
    }
    else{
      this.favorite = this.foodsForm.get('favorite')!.value;
    }
    

    const originvalue = this.textareaContentOrigins;
    this.originsvalue = originvalue;
    if(this.originsvalue == ""){
      this.originsvalue = "India";
    }

    if(this.textareaContentOrigins == ""){
      this.origins = this.editfood.origins;
    }
    else{
      this.origins = this.originsvalue.split('\n').map((line: string) => line.trim());
    }
    

    this.food.tags = this.tags;
    this.food.favorite = this.favorite;
    this.food.imageUrl = this.imageUrl;
    this.food.origins = this.origins;

    const confirmation = window.confirm(`Are you sure you want to edit ${this.food.name}?`);
    if(confirmation){
      this.foodService.updateFood(this.foodId, this.food).subscribe({
        next:() => {
          this.toastrService.success(`Food Edited Successfully`);
          this.router.navigateByUrl('/');
        },
        error:(errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Food');
        }
      })
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openDialogTags(): void {
    this.isDialogOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '250px';
    dialogConfig.data = { options: ['FastFood', 'Lunch', 'Pizza', 'SlowFood', 'Fry', 'Hamburger', 'Soup'] };
    dialogConfig.position = { top: '-50%', left: '40%' };
    dialogConfig.panelClass = 'custom-dialog-container';

    const dialogRef = this.dialog.open(CheckboxDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      if (result) {
        this.textareaContentTags = Object.keys(result).filter(option => result[option]).join('\n');
      }
      const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>;
      const activeElement = document.activeElement as HTMLElement;

      const currentIndex = Array.from(focusableElements).indexOf(activeElement);

      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        const nextElement = focusableElements[nextIndex];

        if (nextElement) {
          nextElement.focus();
        }
      }
    });
    console.log(this.inputValue);
  }

  openDialogOrigins(): void {
    this.isDialogOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '250px';
    dialogConfig.data = { options: ['Asia', 'India', 'Belgium', 'France', 'Germany', 'US', 'Persia', 'Middle East', 'China', 'Italy'] };
    dialogConfig.position = { top: '-50%', left: '40%' };
    dialogConfig.panelClass = 'custom-dialog-container';

    const dialogRef = this.dialog.open(CheckboxDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      if (result) {
        this.textareaContentOrigins = Object.keys(result).filter(option => result[option]).join('\n');
      }
      const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>;
      const activeElement = document.activeElement as HTMLElement;

      const currentIndex = Array.from(focusableElements).indexOf(activeElement);

      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        const nextElement = focusableElements[nextIndex];

        if (nextElement) {
          nextElement.focus();
        }
      }
    });
  }

  onEnterName(value: string): void {
    this.food.name = value;
  }

  onEnterPrice(value: string): void {
    this.food.price = parseFloat(value);
  }

  onEnterStars(value: string): void {
    this.food.stars = parseFloat(value);
  }

  onEnterCookingTime(value: string): void {
    this.food.cookTime = value;
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.checkTextareaFocus();
    }, 300); // Check every 100 milliseconds
  }

  checkTextareaFocus() {
    if (document.activeElement === this.myTextareatags.nativeElement) {
      this.openDialogTags();
    }
    if (document.activeElement === this.myTextareaorigins.nativeElement) {
      this.openDialogOrigins();
    }
  }
  
}
