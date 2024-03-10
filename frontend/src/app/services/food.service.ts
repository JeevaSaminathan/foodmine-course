import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from 'src/data';
import { Tag } from '../shared/models/Tag';
import { HttpClient } from '@angular/common/http';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOOD_BY_ID_URL, FOOD_CREATE_URL, FOOD_DELETE_URL, FOOD_GET_FOODS_URL, FOOD_UPDATE_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient) { }

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm:string){
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag:string): Observable<Food[]>{
    return tag === "All"?
    this.getAll():
    this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  getFoodById(foodId:string): Observable<Food>{
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

  getFoods(): Observable<Food[]>{
    return this.http.get<Food[]>(FOOD_GET_FOODS_URL);
  }

  create(food:Food){
    return this.http.post<Food>(FOOD_CREATE_URL, food);
  }

  deleteFood(foodId:string){
    return this.http.delete<Food>(FOOD_DELETE_URL + foodId);
  }

  updateFood(foodId:string,food:Food){
    return this.http.put<Food>(FOOD_UPDATE_URL + foodId, food);
  }
}
