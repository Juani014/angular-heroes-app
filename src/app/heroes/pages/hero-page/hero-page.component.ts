import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit{

  public hero?: Hero;
  public charactersMap = {
    '=1': 'Otro nombre: ',
    'other': 'Otros nombres: '
  };

  constructor(private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        //delay(500),
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe(myHero => {
        if (!myHero) return this.router.navigate(['/heroes/list']);
        this.hero = myHero;
        return;
      }
      );
  }

  goBack():void {
    this.router.navigateByUrl('heroes/list');
  }
}
