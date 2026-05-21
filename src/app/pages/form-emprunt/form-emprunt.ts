import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {UtilisateurService} from '../../core/services/utilisateur/utilisateur.service';
import {CategorieModeleService} from '../../core/services/categorie-modele/categorie-modele.service';
import {EmpruntDto} from '../../core/models/emprunt-dto';
import {Auth} from '../../core/services/authentification/auth';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-form-emprunt',
  imports: [FormsModule],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})
export class FormEmprunt implements OnInit {

  materielService       = inject(MaterielService);
  utilisateurService    = inject(UtilisateurService);
  categorieModeleService = inject(CategorieModeleService);
  empruntService        = inject(EmpruntService);
  route                 = inject(ActivatedRoute);
  router                = inject(Router);
  authService = inject(Auth)
  notification = inject(NotificationService)

  empruntId = signal<number | null>(null);
  estModification = computed(() => this.empruntId() !== null);

  utilisateurId    = signal<number | null>(null);
  categorieModeleId = signal<number | null>(null);
  materielId       = signal<number | null>(null);
  dateDebut        = signal<string>('');
  dateFin          = signal<string>('');
  note= signal<string>('');
  erreurDates = signal<string>('');

  erreurs = signal<Record<string, string>>({});
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.utilisateurService.obtenirListeUtilisateur().subscribe();
    this.categorieModeleService.obtenirListeCategorieModele().subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    console.log(id)
    if (id) {
      this.empruntId.set(+id);
      this.chargerEmprunt(+id);
    } else if (!this.authService.isAdmin()) {
      const idJwt = this.authService.jwtInfo()?.id;
      console.log('idJwt:', idJwt);
      if (idJwt) this.utilisateurId.set(+idJwt);
      console.log(this.utilisateurId())
    }
  }

  chargerEmprunt(id: number): void {
    this.empruntService.obtenirEmpruntParId(id).subscribe(emprunt => {
      this.utilisateurId.set(emprunt.utilisateur.id);
      this.dateDebut.set(emprunt.dateDebut);
      this.dateFin.set(emprunt.dateFin);
      this.categorieModeleId.set(emprunt.materiel.modele.categorieModele.id);
      this.note.set(emprunt.note)

      this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
        emprunt.dateDebut,
        emprunt.dateFin,
        emprunt.materiel.modele.categorieModele.id
      ).subscribe((listeMateriel) => {
        const dejaDansListe = listeMateriel.some(materiel => materiel.id === emprunt.materiel.id);
        if (!dejaDansListe) {
          this.materielService.listeMaterielDisponiblePourPeriodeParIdCategorie
            .update(liste => [emprunt.materiel, ...liste]);
        }
        this.materielId.set(emprunt.materiel.id);
      });
    });
  }

  dateDebutChange(date: string): void {
    this.dateDebut.set(date);
    this.validerDates();
    this.onRechercherMateriels();
  }

  dateFinChange(date: string): void {
    this.dateFin.set(date);
    this.validerDates();
    this.onRechercherMateriels();
  }

  validerDates(): void {
    const debut = this.dateDebut();
    const fin   = this.dateFin();
    const dateActuelle = new Date().toISOString().split('T')[0];

    // Cas 1 — date de début dans le passé
    if (debut && debut < dateActuelle) {
      this.erreurDates.set('La date de début ne peut pas être dans le passé');
      return; // ← on sort, inutile de vérifier le reste
    }

    // Cas 2 — date de fin dans le passé
    if (fin && fin < dateActuelle) {
      this.erreurDates.set('La date de fin ne peut pas être dans le passé');
      return;
    }

    // Cas 3 — date de fin <= date de début
    if (debut && fin && fin <= debut) {
      this.erreurDates.set('La date de fin doit être supérieure à la date de début');
      return;
    }

    // Aucune erreur
    this.erreurDates.set('');
  }
  categorieModeleChange(id: number): void {
    this.categorieModeleId.set(id);
    this.onRechercherMateriels();
  }

  onRechercherMateriels(): void {
    if (!this.dateDebut() || !this.dateFin() || !this.categorieModeleId()) return;
    this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
      this.dateDebut(),
      this.dateFin(),
      this.categorieModeleId()!
    ).subscribe();
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.erreurs.set({});

    const utilisateurId     = this.utilisateurId();
    const materielId        = this.materielId();
    const categorieModeleId = this.categorieModeleId();

    if (!utilisateurId || !materielId || !categorieModeleId || !this.dateDebut() || !this.dateFin()) {
      this.erreurs.set({
        ...(!utilisateurId      && { utilisateurId: "L'utilisateur est obligatoire" }),
        ...(!categorieModeleId  && { categorieModeleId: "La catégorie matériel est obligatoire" }),
        ...(!materielId         && { materielId: "Le matériel est obligatoire" }),
        ...(!this.dateDebut()   && { dateDebut: "La date de début est obligatoire" }),
        ...(!this.dateFin()     && { dateFin: "La date de fin est obligatoire" }),
      });
      return;
    }
    const confirmed = await this.notification.confirm(
      this.estModification()
        ? 'Voulez-vous vraiment modifier cet emprunt ?'
        : 'Voulez-vous vraiment enregistrer cet emprunt ?',
      this.estModification() ? 'Modification' : 'Confirmation'
    );
    if (!confirmed) return;

    this.isLoading.set(true);


    const dataEmprunt: EmpruntDto = {
      utilisateurId,
      materielId,
      dateDebut: this.dateDebut(),
      dateFin:   this.dateFin(),
      note: this.note()
    };

    if (this.estModification()) {
      this.empruntService.modifierEmprunt(this.empruntId()!, dataEmprunt).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.notification.success('Emprunt modifié avec succès');
          setTimeout(() => this.router.navigate(['/emprunt/liste']), 1500);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err);
          }
        },
      });
      return;
    }

    this.empruntService.creerEmprunt(dataEmprunt).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.erreurs.set({});
        this.notification.success('Emprunt enregistré avec succès');
        form.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        if (!this.notification.applyFieldErrors(err, this.erreurs)) {
          this.notification.fromHttpError(err);
        }
      },
    });
  }

  onAnnuler(): void {
    this.router.navigate(['/emprunt/liste']);
  }
}
