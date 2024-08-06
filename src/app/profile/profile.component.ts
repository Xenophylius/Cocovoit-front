import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  userProfile: any;
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize form with empty values and validators
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUserProfile();
    } else {
      console.error('User ID is not available in localStorage');
    }
  }

  loadUserProfile(): void {
    if (this.userId) {
      this.profileService.getUserProfile(this.userId).subscribe(
        data => {
          this.userProfile = data;
          // Populate form with user data
          this.profileForm.patchValue(data);
        },
        error => {
          console.error('Erreur lors de la récupération du profil utilisateur:', error);
        }
      );
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.profileForm.valid && this.userId) {
      this.profileService.updateUserProfile(this.userId, this.profileForm.value).subscribe(
        response => {
          this.userProfile = response; // Update profile with new data
          this.isEditing = false;
          console.log('Profil mis à jour avec succès:', response);

          // Optionally, navigate to refresh the view
          this.router.navigate([`/profile/${this.userId}`]).then(() => {
            this.loadUserProfile(); // Ensure the view is updated
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour du profil:', error);
        }
      );
    }
  }
}
