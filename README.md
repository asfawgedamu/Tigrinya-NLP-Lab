# Tigrinya NLP Dialect Identification Lab

An interactive research application for exploring Tigrinya dialect identification, Ethiopic Fidel forms, corpus files and the benchmark data stored with this project.

The application is a React-based research workbench. It is no longer a personal portfolio or a multi-page professional website.

> **Implementation status:** the current browser inference component is a rule-based demonstration. It does not load trained model weights, call a model-serving API, or reproduce the reported benchmark experiment. The browser-side review queue is also a demonstration and is not backed by secure authentication or persistent storage. These boundaries are stated in the interface.

## Research context

The project is associated with the paper [Tigrinya Dialect Identification](https://openreview.net/forum?id=kiG8qiUFm2u). The current project data describes three labels:

- **Variety Z:** Northern / Standard Tigrinya.
- **Variety L:** Enderta / Mekelle variety.
- **Variety D:** Rayya variety.

The paper-reported benchmark figures stored in `src/data/nlpData.ts` are shown separately from the live heuristic demonstration. Consult the paper for the study's methodology and reported evaluation.

## Application modules

1. **Inference and corpus workbench** – enter Tigrinya text, inspect heuristic outputs, and upload `.txt` or `.csv` files for browser-side batch processing.
2. **Fidel matrix** – browse the Ethiopic character forms represented in the supplied project dataset, with search and category filters.
3. **Benchmark metrics** – inspect the model metrics recorded in the project data and compare the stored accuracy and macro-F1 values.
4. **Research and data** – access the research paper, source-data files and a summary of implementation status.

The inference and moderation modules are prototypes. They should not be treated as production NLP services or as a replacement for validated research evaluation.

## Technology stack

- HTML5 application shell
- CSS3 and Tailwind CSS 4
- JavaScript / TypeScript with React 19 and JSX/TSX components
- Vite 8 development server and production bundler
- Recharts for benchmark visualizations
- Lucide React for interface icons

TypeScript is used for source typing, but the application is not a TypeScript-only product. The user interface is built with standard web technologies, React components, CSS and Tailwind utilities.

## Requirements

- Node.js **20.19+** or **22.12+**
- npm 10+ (or a compatible package manager)

## Run locally

```bash
git clone https://github.com/asfawgedamu/Tigrinya-lab.git
cd Tigrinya-lab
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate and build

```bash
npm run typecheck
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Project structure

```text
Tigrinya-lab/
├── public/
│   └── research/                 # Paper PDF and dialect sample text files
├── src/
│   ├── components/
│   │   ├── research/
│   │   │   ├── BenchmarkDashboard.tsx
│   │   │   └── FidelMatrix.tsx
│   │   └── TigrinyaDialectLab.tsx # Heuristic inference, batch and local review demo
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   ├── nlpData.ts            # Fidel data, samples and stored benchmark metrics
│   │   ├── tigrinyaCorpus.ts
│   │   └── tigrinyaCorpusData.json
│   ├── App.tsx                   # Research workbench navigation and layout
│   ├── index.css                 # Tailwind entry point and design tokens
│   └── main.tsx                  # React application entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Next research-engineering milestones

- Implement a reproducible inference backend and connect validated trained model artifacts.
- Add dataset provenance, versioning, annotation guidelines and evaluation scripts.
- Reproduce the reported metrics from documented train/test splits and saved predictions.
- Move feedback submission and moderation to a server-side API with proper authentication, authorization, audit history and persistent storage.
- Add automated tests for language validation, dialect rules, file parsing and inference API contracts.

## Citation

The project refers to the following OpenReview submission:

```bibtex
@inproceedings{gedamu2024tigrinya,
  title={Tigrinya Dialect Identification},
  author={Gedamu, Asfaw and Hadgu, Asmelash Teka and Abate, Solomon Teferra},
  year={2024},
  url={https://openreview.net/forum?id=kiG8qiUFm2u}
}
```

Verify the final author order and preferred citation format against the published paper before using this BibTeX entry in a manuscript.

## License

The original repository README described the project as MIT-licensed, but the supplied archive did not contain a `LICENSE` file. Add the appropriate license text and confirm the rights to the research paper, corpus samples and other included materials before distributing this project under an open-source license.
