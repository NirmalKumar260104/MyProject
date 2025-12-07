import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule,RouterLink],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  buttontitle = 'Add';
  AllCategories : any = [];
  NewCategory = {
      id: 0,
      name: '',
      description:'',
      imageUrl: '',
  };

  constructor(private adminservice : AdminService,
    private http :HttpClient,
    private router : Router,
    private notification: NotificationService,
    private route : ActivatedRoute,
    private authservice : AuthService
  ){}
  ngOnInit(){
    const catid = this.route.snapshot.paramMap.get("id");
    if(catid)
    {
      this.adminservice.GetCategoryByIdForAdmin(catid).subscribe({
        next: (cate:any) =>{
          this.buttontitle = 'Update';
          this.NewCategory = {
            id:  cate.id ?? this.NewCategory.id,
            name:  cate.name ?? this.NewCategory.name ,
            description:  cate.description ?? this.NewCategory.description,
            imageUrl: cate.imageUrl ?? this.NewCategory.imageUrl
          };
        },
        error: (error) => console.error("Error fetching category details", error)
      });
    }
  }
  validateCategory(): boolean {
    if(!this.NewCategory.name.trim() || !this.NewCategory.description.trim())
    {
      this.notification.ShowMessage("All fields except image must be filled correctly!", "warn", 3000);
      return false;
    }
    return true;
  }
  AddOrUpdateCategory(){
    if(!this.validateCategory()) return;
    const token = this.authservice.getToken();
    
    const formdata = new FormData();
    formdata.append('name',this.NewCategory.name);
    formdata.append('description',this.NewCategory.description);

    if(this.NewCategory.imageUrl){
      formdata.append('ImageFile',this.NewCategory.imageUrl)
    }

    const apiUrl = this.NewCategory.id ? `http://localhost:5156/api/categories/${this.NewCategory.id}` : 'http://localhost:5156/api/Categories';
    
    const requestMethod = this.NewCategory.id ? this.http.put.bind(this.http) : this.http.post.bind(this.http);
    requestMethod(apiUrl, formdata, {
      headers: token ? {Authorization : `Bearer ${token}`} : {},
      withCredentials: true
    }).subscribe(()=>
    {
      this.notification.ShowMessage(this.NewCategory.id ? "Product updated successfully!" : "Product added successfully!","good",3000);
      this.router.navigate(["/admin/Categories"]);
    },
    (error) =>{
      console.error("Error saving product:", error);
          this.notification.ShowMessage(
            this.NewCategory.id ? "Failed to update category." : "Failed to add category.","warn", 3000);
    }
  );
  }
  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    console.log(file);
    this.NewCategory.imageUrl = file;
  }
}
