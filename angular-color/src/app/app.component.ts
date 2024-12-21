import {Component, inject, Renderer2} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {InputColor, Theme, themeKeys} from './theme';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerComponent,
  NgxMatColorPickerInput,
  NgxMatColorToggleComponent
} from '@hrefcl/color-picker';
import {JsonPipe} from '@angular/common';
import {debounceTime} from 'rxjs';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggle, MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'aco-root',
  imports: [MatButtonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatSliderModule, MatInput, NgxMatColorToggleComponent, NgxMatColorPickerComponent, NgxMatColorPickerInput, JsonPipe, MatSlideToggle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS}
  ]
})
export class AppComponent {
  private fb = inject(FormBuilder);
  public formTheme = this.buildForm(this.fb);

  private renderer = inject(Renderer2);
  private headDocument = document.getElementsByTagName('head')[0] as HTMLHeadElement;
  private lastStyle?: HTMLStyleElement;

  constructor() {
    this.formTheme.valueChanges.pipe(
      debounceTime(700),
    ).subscribe(() => {

      const entries = Object.entries(this.formTheme.getRawValue());
      const theme: Record<string, string> = {}
      for (const [key, value] of entries) {
        if (value) {
          theme[key] = "#" + (value as InputColor).hex
        }
      }

      if (Object.keys(theme).length > 0) {
        this.changeTheme(theme as Theme);
      }
    })

  }

  public get controlNames() {
    const controls = this.formTheme.controls;
    return Object.keys(controls)
  }

  darkMode(event: MatSlideToggleChange) {
    document.body.classList.remove('dark');
    if (!event.checked) {
      document.body.classList.add('dark');
    }
  }

  private buildForm(fb: FormBuilder) {
    const form = fb.group({});
    for (const key of themeKeys) {
      form.addControl(key, new FormControl("", Validators.required));
    }
    return form;
  }

  private buildCss(theme: Theme) {

    const PREFIX = "--mat-sys-";
    const entries = Object.entries(theme);
    const index = entries.length;
    const css: string[] = [];
    for (let i = 0; i < index; i++) {
      const [key, value] = entries[i];
      css.push(`${PREFIX}${key}: ${value.toString()};`);
    }

    return `.custom-theme{
      ${css.join('\n')}
    }`
  }

  private changeTheme(theme: Theme) {
    if (this.lastStyle) {
      this.headDocument.removeChild(this.lastStyle);
    }
    const style = this.renderer.createElement('style') as HTMLStyleElement;
    style.innerHTML = this.buildCss(theme);
    this.lastStyle = style;

    this.headDocument.appendChild(style);

  }
}
