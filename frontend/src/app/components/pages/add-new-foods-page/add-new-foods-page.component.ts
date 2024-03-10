import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';
import { CheckboxDialogComponent } from '../../partials/checkbox-dialog/checkbox-dialog.component';

@Component({
  selector: 'app-add-new-foods-page',
  templateUrl: './add-new-foods-page.component.html',
  styleUrls: ['./add-new-foods-page.component.css']
})
export class AddNewFoodsPageComponent implements OnInit {
  food:Food = new Food();
  foodsForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '';
  imageUrl!: string;
  tags!:string[];
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
      name:['', Validators.required],
      price:['', Validators.required],
      favorite:['', Validators.required],
      stars:['', Validators.required],
      cookingtime:['', Validators.required],
      selectedValues: [[]],
      textareaControl: ['']
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
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

    this.price=this.fc.price.value;
    this.stars=this.fc.stars.value;
    this.cookingtime= this.fc.cookingtime.value;

    const tagvalue = this.textareaContentTags;
    this.tagsvalue = tagvalue;
    if(this.tagsvalue == ""){
      this.tagsvalue = "All";
    }
    this.tags = this.tagsvalue.split('\n').map((line: string) => line.trim());

    this.favorite = this.foodsForm.get('favorite')!.value;
    

    const originvalue = this.textareaContentOrigins;
    this.originsvalue = originvalue;
    if(this.originsvalue == ""){
      this.originsvalue = "India";
    }
    this.origins = this.originsvalue.split('\n').map((line: string) => line.trim());

    this.food.name = this.fc.name.value;
    this.food.price = this.price;
    this.food.tags = this.tags;
    this.food.favorite = this.favorite;
    this.food.stars = this.stars;
    this.food.imageUrl = this.imageUrl;
    this.food.origins = this.origins;
    this.food.cookTime = this.cookingtime;

    this.foodService.create(this.food).subscribe({
      next:() => {
        this.toastrService.success(`Food Added Successfully`);
        this.router.navigateByUrl('/');
      },
      error:(errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Food');
      }
    })
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
