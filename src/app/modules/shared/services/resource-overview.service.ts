import { Injectable } from '@angular/core';

export interface Resource {
  name: string;
  salesCommitment: number[][];
  realCommitment: number[][];
}

@Injectable({
  providedIn: 'root'
})
export class ResourceOverviewService {

  getResources(): Resource[] {
    // Simula il recupero dei dati delle risorse dal backend
    return [
      {
        name: 'Risorsa 1',
        salesCommitment: [
          [100, 80, 70, 90],
          [90, 70, 60, 80],
          [80, 60, 50, 70],
          [70, 50, 40, 60]
        ],
        realCommitment: [
          [90, 70, 60, 80],
          [80, 60, 50, 70],
          [70, 50, 40, 60],
          [60, 40, 30, 50]
        ]
      },
      {
        name: 'Risorsa 2',
        salesCommitment: [
          [100, 90, 80, 70],
          [90, 80, 70, 60],
          [80, 70, 60, 50],
          [70, 60, 50, 40]
        ],
        realCommitment: [
          [90, 80, 70, 60],
          [80, 70, 60, 50],
          [70, 60, 50, 40],
          [60, 50, 40, 30]
        ]
      }
    ];
  }

  getUnits(): string[] {
    // Simula il recupero delle unità dal backend
    return ['Unità 1', 'Unità 2', 'Unità 3', 'Unità 4'];
  }

  getWeeks(): number[] {
    // Simula la generazione delle settimane del calendario
    return [1, 2, 3, 4];
  }

  constructor() { }
}
