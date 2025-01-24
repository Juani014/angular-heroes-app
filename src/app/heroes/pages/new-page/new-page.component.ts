import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  constructor
  (
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      ).subscribe(h => {
        if (!h) {
          return this.router.navigateByUrl('/');
        }
        this.heroForm.reset(h);
        return;
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(h => {
          this.showSnackbar(`${h.superhero} updated!`)
        });
      return;
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(h => {
        this.router.navigate(['/heroes/edit', h.id])
        this.showSnackbar(`${h.superhero} created!`)
      });
  }

  onDeleteButtonPressed() {
    if (!this.currentHero.id) throw Error('Hero Id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });


    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigate(['/'])
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeleted => {
    //       if (wasDeleted) {
    //         this.router.navigate(['/'])
    //       }
    //     })
    // });

  }

  showSnackbar(message: string): void{
    this.snackBar.open(message, 'Ok', {
      duration: 2500,
    })
  }
}
