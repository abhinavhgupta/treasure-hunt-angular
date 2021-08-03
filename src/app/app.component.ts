import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TreasueHuntRequest, TreasueHuntResponse } from './model/treasure-hunt.model';
import { TreasureHuntService } from './service/treasure-hunt.service';

const REGEX = '^[0-9]*$';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public formGroup: FormGroup;
  public showGridButton: boolean;
  public treasueHuntResponse: TreasueHuntResponse;
  public readonly min = 11;
  public readonly max = 55;
  title = 'treasure-hunt';
  public constructor(private _formBuilder: FormBuilder, private _treasureHuntService: TreasureHuntService) {
  }

  public ngOnInit(): void {
    this._createFormGroup();
  }

  public generateTable(): void {

    const row = this.formGroup.controls.rowNumber.value;
    const column = this.formGroup.controls.columnNumber.value;
    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
      const lessonForm = this._formBuilder.group({
        row: this._formBuilder.array([])
      });
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        (lessonForm.controls.row as FormArray).push(this._formBuilder.group({ column: new FormControl('', [Validators.min(this.min), Validators.max(this.max), Validators.pattern(REGEX), Validators.required]) }))
      }
      this.getTableFormArray().push(lessonForm);
    }
    console.log('onSubmit', row, column);

    this.showGridButton = true;
  }

  public getTableFormArray(): FormArray {
    return this.formGroup.get('table') as FormArray;
  }

  public getRowArray(index: number): FormArray {
    return this._getRowFormArray(index).get('row') as FormArray;
  }

  public findTreasure() {
    console.log('find');
    const treasueHuntRequest = {} as TreasueHuntRequest;
    treasueHuntRequest.data = [];

    const table = this.formGroup.controls.table as FormArray;

    table.controls.forEach((rowFG, rowIndex: number) => {
      treasueHuntRequest.data.push([])
      const rowFormGroup = rowFG as FormGroup
      const rowFormArray = rowFormGroup.controls.row as FormArray;

      rowFormArray.controls.forEach((columnFG, columnIndex) => {
        const columnFormGroup = columnFG as FormGroup;
        console.log(columnFormGroup.controls, columnIndex);
        treasueHuntRequest.data[rowIndex][columnIndex] = columnFormGroup.controls.column.value;
      });
    });
    console.log(treasueHuntRequest);

    this._treasureHuntService.getTreasureHunt(treasueHuntRequest).subscribe((obj: TreasueHuntResponse) => {
      console.log('_treasureHuntService', obj);
      this.treasueHuntResponse = obj;
    });
  }

  public reset() {
    this._createFormGroup();
    this.showGridButton = false;
    this.formGroup.reset();
  }

  public validateTable(rowIndex: number, colIndex: number): boolean {
    const controls = (this.getRowArray(rowIndex).controls[colIndex] as FormGroup).controls;
    return controls.column.touched && !!controls.column.errors;
  }

  private _getRowFormArray(index: number): AbstractControl {
    return this.getTableFormArray().controls[index];
  }

  private _createFormGroup(): void {
    this.formGroup = this._formBuilder.group({
      rowNumber: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern(REGEX), Validators.min(5)]),
      columnNumber: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.min(5), Validators.pattern(REGEX)]),
      table: this._formBuilder.array([])
    });
  }
}
