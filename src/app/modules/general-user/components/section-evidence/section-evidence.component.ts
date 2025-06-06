import { Component, OnInit, ViewChildren, Input, QueryList, ElementRef, Renderer2, ChangeDetectorRef, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { CharacteristicID, CharacteristicWithEvidence } from 'src/app/models/characteristic';
import { EvidenceID } from 'src/app/models/evidence';
import { DocumentService } from 'src/app/services/document/document.service';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';

@Component({
  selector: 'app-section-evidence',
  templateUrl: './section-evidence.component.html',
  styleUrls: ['./section-evidence.component.scss']
})
export class SectionEvidenceComponent implements OnInit,AfterViewInit,OnChanges {
  @ViewChildren('titleDiv') titleDivList!:QueryList<ElementRef>;
  @Input() title='Objetivos y Metas'
  @Input() characteristicWithEvidences!:CharacteristicWithEvidence

  evidences:EvidenceID[]=[]
  characteristic!:CharacteristicID

  constructor(
    private renderer:Renderer2,
    private cdr:ChangeDetectorRef,
    private documentService:DocumentService,
    private evidenceService:EvidenceService
  ) { }

  extractFileNameFromLink(link: string): string {
    try {
      const url = new URL(link);
      const srcParam = url.searchParams.get('src');
      if (srcParam) {
        const decodedSrc = decodeURIComponent(srcParam);
        const fileNameFromSrc = this.extractFileNameFromLink(decodedSrc); 
        if (fileNameFromSrc) return fileNameFromSrc;
      }

      const path = decodeURIComponent(url.pathname);
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return 'documento';

      const lastSegment = segments[segments.length - 1];

      const extensionMatch = lastSegment.match(/\.(pdf|docx?|xlsx?|pptx?|jpg|jpeg|png)$/i);
      if (extensionMatch) return lastSegment;

      return lastSegment.replace(/[-_]/g, ' ').replace(/\.\w+$/, '');
    } catch (e) {
      return 'documento';
    }
  }

  adjustSizeText(){
    this.titleDivList.map((divElement:ElementRef)=>{
      const containerWidth = divElement.nativeElement.clientWidth;
      const contentWidth = divElement.nativeElement.scrollWidth;
      const fontSize = Math.min(100, containerWidth / (contentWidth / 12));
    
        this.renderer.setStyle(divElement.nativeElement, 'font-size', `${fontSize}px`);
      this.renderer.setStyle(divElement.nativeElement, 'height', 'auto');
    })
  }

  // ngOnChanges(changes:SimpleChanges){
  //   if(this.characteristicWithEvidences){
  //     this.title = this.characteristicWithEvidences.characteristic.name
  //     this.evidences = this.characteristicWithEvidences.evidences as EvidenceID[]
  //     this.characteristic=this.characteristicWithEvidences.characteristic
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.characteristicWithEvidences) {
      this.title = this.characteristicWithEvidences.characteristic.name;
      const characteristicName = this.characteristicWithEvidences.characteristic.name;

      this.evidences = (this.characteristicWithEvidences.evidences as EvidenceID[]).map(evidence => {
        const nameIsSuspicious = evidence.name.trim().toLowerCase() === characteristicName.trim().toLowerCase();

        if (nameIsSuspicious && evidence.link) {
          const fileName = this.extractFileNameFromLink(evidence.link.toString());
          return { ...evidence, name: fileName };
        }

        return evidence;
      });

      this.characteristic = this.characteristicWithEvidences.characteristic;
    }
  }

  setEvidence(evidence:EvidenceID){
    this.documentService.setDocumentSelected(evidence.link as string)
    this.evidenceService.setEvidenceSelected(evidence)
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.titleDivList.changes.subscribe(()=>{
      this.adjustSizeText()
    })
    this.cdr.detectChanges();
    this.adjustSizeText();
  }

}
