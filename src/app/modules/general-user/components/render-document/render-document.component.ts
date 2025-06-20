import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { EvidenceID } from 'src/app/models/evidence';
import { ValuationID } from 'src/app/models/valuation';
import { RubricID } from 'src/app/models/rubric';
import { DocumentService } from 'src/app/services/document/document.service';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';
import { CharacteristicsService } from 'src/app/services/characteristics/characteristics.service';
import { filter } from 'rxjs/operators';

interface RubricTableEntry {
  name: string;
  category: string;
  qualification: number;
  maxValue: number;
}

@Component({
  selector: 'app-render-document',
  templateUrl: './render-document.component.html',
  styleUrls: ['./render-document.component.scss']
})
export class RenderDocumentComponent implements OnInit {
  url!: string;
  evidence!: EvidenceID;
  note: string | null = null;
  name: string | null = null;
  rubricTable: RubricTableEntry[] = [];

  constructor(
    private documentService: DocumentService,
    private evidenceService: EvidenceService,
    private characteristicService: CharacteristicsService
  ) {}

  ngOnInit(): void {
  combineLatest([
    this.evidenceService.getEvidenceSelected(),
    this.documentService.getDocumentSelected()
  ])
  .pipe(filter(([evidence, document]) => evidence && evidence.characteristicID !== ''))
  .subscribe(([evidence, document]) => {
    this.url = document;

    this.evidenceService.getEvidenceByID(evidence.id).subscribe(fullEvidence => {
      this.evidence = fullEvidence;
      this.name = fullEvidence.name;
      this.note = fullEvidence.link === document ? fullEvidence.note : null;

      this.rubricTable = (fullEvidence.rubric || []).map((rubric: any) => {
        return {
          name: rubric.valuation?.name || 'Sin nombre',
          category: rubric.valuation?.category || 'Sin categoría',
          qualification: rubric.qualification || 0,
          maxValue: rubric.valuation?.maxValue || 0
        };
      });
    });
  });
}

}
