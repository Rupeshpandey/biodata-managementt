import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BiodataService } from 'src/app/serveices/biodata.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-biodata-form',
  templateUrl: './biodata-form.component.html',
  styleUrls: ['./biodata-form.component.css']
})
export class BiodataFormComponent implements OnInit {
  biodataForm: FormGroup;
  selectedFiles: File[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(private fb: FormBuilder, private biodataService: BiodataService, private router: Router) {
    this.biodataForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      fatherName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      qualifications: this.fb.array([]),
      documents: this.fb.array([])
    });
    
  }
  
  

  ngOnInit(): void {
    this.addQualification(); // Add initial row
    this.addDocument(); // Add initial row
  }

  get qualifications(): FormArray {
    return this.biodataForm.get('qualifications') as FormArray;
  }

  get documents(): FormArray {
    return this.biodataForm.get('documents') as FormArray;
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-Z ]*$/.test(control.value);
      return valid ? null : { 'invalidName': { value: control.value } };
    };
  }
  
  
  


 // Check if all fields in a qualification row are filled
isRowValid(qualification: AbstractControl): boolean {
  const formGroup = qualification as FormGroup;
  return !!(formGroup.get('courseName')?.valid &&
            formGroup.get('university')?.valid &&
            formGroup.get('passingYear')?.valid &&
            formGroup.get('percentage')?.valid);
}

// Check if all fields in a document row are filled
isDocumentRowValid(document: AbstractControl): boolean {
  const formGroup = document as FormGroup;
  return !!(formGroup.get('type')?.valid && this.selectedFiles.length > 0);
}


  addQualification(index?: number): void {
    const newQualification = this.fb.group({
      courseName: ['', Validators.required],
      university: ['', Validators.required],
      passingYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    if (index !== undefined) {
      // Move the existing data down
      this.qualifications.insert(index + 1, this.qualifications.at(index));
      // Replace the top row with a new empty row
      this.qualifications.setControl(index, newQualification);
      // Disable the fields of the added row (to prevent editing after adding)
      this.qualifications.at(index + 1).disable();
    } else {
      this.qualifications.push(newQualification);
    }
  }

  removeQualification(index: number): void {
    if (this.qualifications.length > 1) {
      this.qualifications.removeAt(index);
    }
  }

  addDocument(index?: number): void {
    const newDocument = this.fb.group({
      type: ['', Validators.required],
      file: [null]
    });

    if (index !== undefined) {
      // Move the existing data down
      this.documents.insert(index + 1, this.documents.at(index));
      // Replace the top row with a new empty row
      this.documents.setControl(index, newDocument);
      // Disable the fields of the added row (to prevent editing after adding)
      this.documents.at(index + 1).disable();
    } else {
      this.documents.push(newDocument);
    }
  }

  removeDocument(index: number): void {
    if (this.documents.length > 1) {
      this.documents.removeAt(index);
    }
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFiles[index] = input.files[0];
    }
  }

  onSubmit(): void {
    // Check if qualifications and documents are valid and contain data
    if (this.qualifications.length < 2) { // Assuming 1 default empty row
      Swal.fire('Error', 'Please add at least one qualification.', 'error');
      return;
    }
  
    if (this.documents.length < 2 || this.selectedFiles.length === 0) { // Assuming 1 default empty row
      Swal.fire('Error', 'Please add at least one document and upload the file.', 'error');
      return;
    }
  
    // Prepare form data
    const formData = new FormData();
    formData.append('name', this.biodataForm.value.name);
    formData.append('fatherName', this.biodataForm.value.fatherName);
    formData.append('dob', this.biodataForm.value.dob);
    formData.append('nationality', this.biodataForm.value.nationality);
    formData.append('address', this.biodataForm.value.address);
  
    // Define default values
    const defaultPassingYear = 2000;
    const defaultPercentage = 50;
  
    // Handle qualifications
    const qualificationsArray = this.biodataForm.value.qualifications;
    const formattedQualificationsData = qualificationsArray.slice(1).map((item: any) => ({
      ...item,
      passingYear: item.passingYear ? Number(item.passingYear) : defaultPassingYear,
      percentage: item.percentage ? Number(item.percentage) : defaultPercentage
    }));
    formData.append('qualificationsJson', JSON.stringify(formattedQualificationsData));
  
    // Handle documents
    this.documents.controls.forEach((control: AbstractControl, index: number) => {
      const documentControl = control as FormGroup;
      const file = this.selectedFiles[index];
      if (file) {
        formData.append('documents', file, file.name);
        formData.append('documentTypes', documentControl.value.type);
      }
    });
  
    // Call service to submit the data
    this.biodataService.createBiodata(formData).subscribe(
      response => {
        Swal.fire('Success', 'BioData Submitted!', 'success');
        this.router.navigate(['/biodata-list']);
        this.resetForm();
      },
      error => {
        Swal.fire('Error', 'Submission Failed', 'error');
      }
    );
  }
  
  
  
  
  
  
  

  resetForm(): void {
    this.biodataForm.reset();
    this.selectedFiles = [];
    while (this.qualifications.length) {
      this.qualifications.removeAt(0);
    }
    while (this.documents.length) {
      this.documents.removeAt(0);
    }
    this.addQualification(); // Add default empty row
    this.addDocument(); // Add default empty row
  }
}
