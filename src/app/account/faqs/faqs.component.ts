import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css'
})
export class FaqsComponent {
  dropdownStates: { [key: string]: boolean } = {}; // Stato aperto/chiuso per ogni dropdown
  openDropdowns: string[] = []; // Nessun menu aperto all'inizio.

  dropdownData = [
    {
      id: 'menu1',
      title: 'Prodotti',
      items: [
        {
          id: 'menu1.item1',
          title: 'Prodotto non disponibile nel magazzino',
          children: [
            { id: 'menu1.item1.submenu1', title: 'Solitamente i tempi di rifornimento sono di una settimana.' },
          ],
        },
        { id: 'menu1.item0', title: ''},
      ],
    },
    {
      id: 'menu2',
      title: 'Consegna',
      items: [
        {
          id: 'menu2.item2',
          title: 'Tempi di consegna',
          children: [
            { id: 'menu2.item2.submenu2', title: "Le date di consegna sono stimate e calcolate dal sistema in automatico in base a tutte le variabili dell'ordine (metodo di pagamento, disponibilità degli articoli nei depositi nazionali ed esteri, zona di residenza, etc...)." },
          ],
        },
        {
          id: 'menu2.item3',
          title: 'Modalità di consegna di consegna',
          children: [
            { id: 'menu2.item3.submenu3', title: "BikeVille effettua consegne solamente sul territorio nazionale. Sono escluse Città del Vaticano, Repubblica di San Marino e Campione d'Italia. Poi vediamo le modalità boh" },
          ],
        },
      ],
    },
    {
      id: 'menu3',
      title: 'Pagamento',
      items: [
        {
          id: 'menu3.item4',
          title: 'Metodi di pagamento accettati',
          children: [
            { id: 'menu3.item4.submenu4', title: "CARTA DI CREDITO: Accettiamo le Carte di credito, prepagate incluse, facenti parte dei circuiti: Visa, Mastercard, American Express e Visa Electron (inclusa Postepay)." },
          ]
        },
        {
          id: 'menu3.item5',
          title: 'Tempi e modalità di rimborso',
          children: [
            { id: 'menu3.item5.submenu5', title: "Il rimborso di un ordine avviene sempre sul mezzo di pagamento utilizzato. Le tempistiche di rimborso con Carta di Credito sono di circa 10 giorni lavorativi; la tempistica effettiva dipende dal tipo di carta di credito utilizzata e dal circuito bancario."}
          ]
        },
      ],
    },
    {
      id: 'menu4',
      title: 'Ordini',
      items: [
        {
          id: 'menu4.item6',
          title: 'Posso modificare o annullare il mio ordine?',
          children: [
            { id: 'menu4.item6.submenu6', title: "MODIFICA: Se desideri modificare il tuo ordine dovrai contattare il Centro Relazioni Clienti, che verificherà la fattibilità dell'operazione (nel caso in cui l'ordine fosse in preparazione, non sarà possibile apportare alcuna modifca). " },
            { id: 'menu4.item6.submenu7', title: "ANNULLAMENTO: Un ordine online è annullabile non appena creato e in alcune fasi della sua preparazione; trascorse queste fasi, non può più essere cancellato."},
          ]
        },
      ],
    },
    {
      id: 'menu5',
      title: 'Resi',
      items: [
        {
          id: 'menu5.item7',
          title: 'Come fare un reso online',
          children: [
            { id: 'menu5.item7.submenu8', title: "Per avviare la richiesta di reso, collegati alla sezione Acquisti del tuo account. Scegli il prodotto che desideri restituire e seleziona il tasto 'Effettua reso'. Seleziona quindi il motivo del reso e scegli come desideri restituire i prodotti: in negozio o in un punto di ritiro. " },
          ]
        },
      ],
    },
  ];
  
 
  //Funzione per aprire/chiudere un menu
  toggleDropdown(id: string): void {
    const isOpen = this.isDropdownOpen(id);
    if (isOpen) {
      // Chiude il menu corrente e i figli
      this.closeDropdownAndChildren(id);
    } else {
      // Apre il menu corrente
      this.dropdownStates[id] = true;
    }
  }

  isDropdownOpen(id: string): boolean {
    return this.dropdownStates[id] || false;
  }

  //   // Funzione per chiudere un menu e i suoi figli
  closeDropdownAndChildren(parentId: string): void {
      Object.keys(this.dropdownStates).forEach((key) => {
        if (key === parentId || key.startsWith(parentId + '.')) {
          this.dropdownStates[key] = false;
        }
      });
    }

  //Ascolta i clic
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    Object.keys(this.dropdownStates).forEach((key) => {
      const dropdown = document.getElementById(`dropdownMenu-${key}`);
      const button = document.getElementById(`dropdownButton-${key}`);

      if (dropdown && button) {
        // Chiude il dropdown se clic fuori
        if (!dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
          this.dropdownStates[key] = false;
        }
      }
    });
  }

}
