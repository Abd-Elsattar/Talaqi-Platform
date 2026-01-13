# Talaqi Platform (تلاقي)

![Talaqi Banner](Talaqi-Frontend/talaqi-frontend/public/images/logo.png)

> **"Meeting point for lost items and their owners."**

**Talaqi** (Arabic for "Meeting" or "Convergence") is a next-generation Lost & Found platform specifically designed for the Egyptian context. It leverages advanced Artificial Intelligence (AI) and Machine Learning to revolutionize how lost items, documents, pets, and even people are reunited with their families.

Unlike traditional notice boards, Talaqi uses **Vector Search**, **Image Recognition**, and **RAG (Retrieval-Augmented Generation)** to intelligently match reported found items with lost requests, even if the descriptions vary significantly.

---

## 🌟 Key Features

### 🧠 AI-Powered Matching
- **Visual Recognition**: Upload an image of a found item, and our AI analyzes it to extract features (color, type, brand).
- **Semantic Search**: Matches items based on meaning rather than just keywords (e.g., matching "Smartphone" with "Mobile").
- **Smart Recommendations**: Automatically suggests potential matches with a confidence score.

### 🤖 Intelligent Assistant (RAG)
- **Chat with Data**: An AI assistant that can answer questions about safety tips, legal procedures for lost documents, and platform usage.
- **Context-Aware**: Uses platform knowledge to provide accurate, localized advice.

### 📍 Location Services
- **Geospatial Matching**: Filters matches based on proximity to where the item was lost/found.
- **Interactive Maps**: Pinpoint exact locations using MapLibre integration.

### 💬 Real-Time Communication
- **Instant Messaging**: Secure chat between the finder and the owner using SignalR.
- **Privacy First**: Contact details are protected until a match is confirmed.

### 🌍 Localization
- **Fully Bilingual**: Native support for **Arabic (RTL)** and **English (LTR)**.
- **Egyptian Context**: Tailored for local administrative divisions (Governorates/Cities).

---

## 🛠️ Technology Stack

### Backend (.NET 8.0)
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, Presentation).
- **Framework**: ASP.NET Core Web API.
- **Data Access**: Entity Framework Core 8.
- **Database**: SQL Server.
- **Real-time**: SignalR.
- **AI Integration**: OpenAI API / Custom Embeddings.
- **Validation**: FluentValidation.
- **Mapping**: AutoMapper.

### Frontend (Angular 20)
- **Framework**: Angular 20 (Standalone Components).
- **Styling**: Bootstrap 5 & SCSS.
- **State/Data**: RxJS.
- **Maps**: MapLibre GL.
- **Localization**: Ngx-Translate.
- **UI Components**: SweetAlert2, Bootstrap Icons.

---

## 📂 Project Structure

The solution follows the **Clean Architecture** principles to ensure scalability and maintainability.

```
Talaqi-Platform/
├── Talaqi-Backend/
│   ├── src/
│   │   ├── Core/
│   │   │   ├── Talaqi.Domain/        # Entities, Enums, Value Objects
│   │   │   └── Talaqi.Application/   # Interfaces, DTOs, Business Logic (CQRS/Services)
│   │   ├── Infrastructure/
│   │   │   ├── Talaqi.Infrastructure/# DbContext, External Services (Email, AI)
│   │   │   └── Talaqi.Shared/        # Shared Kernel
│   │   └── Presentation/
│   │       └── Talaqi.API/           # API Endpoints, Controllers
│   └── tests/                        # Unit & Integration Tests
│
└── Talaqi-Frontend/
    └── talaqi-frontend/
        ├── src/app/
        │   ├── core/                 # Singleton services, Guards, Interceptors, Models
        │   ├── features/             # Feature modules (Auth, Items, Admin, Chat)
        │   └── shared/               # Reusable components, Pipes, Directives
        └── assets/i18n/              # Localization files (ar.json, en.json)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **.NET SDK** (8.0)
- **SQL Server**
- **Angular CLI** (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abd-Elsattar/Talaqi-Platform.git
   cd Talaqi-Platform
   ```

2. **Backend Setup**
   - Navigate to the API directory:
     ```bash
     cd Talaqi-Backend/Talaqi.Solution/src/Presentation/Talaqi.API  
     ```
   - Update `appsettings.json` with your Connection String and API Keys (OpenAI, etc.).
   - Apply Migrations:
     ```bash
     dotnet ef database update --project ../../Infrastructure/Talaqi.Infrastructure
     ```
   - Run the API:
     ```bash
     dotnet run
     ```

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd Talaqi-Frontend/talaqi-frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the application:
     ```bash
     ng serve
     ```
   - Open `http://localhost:4200` in your browser.

---



## 📞 Contact

**Development Team** - [ITI Graduation Project Team]

Project Link: [https://github.com/Abd-Elsattar/Talaqi-Platform]
