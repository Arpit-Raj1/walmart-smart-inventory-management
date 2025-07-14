### Smart Inventory Management System

- Pitch Deck : https://www.figma.com/slides/CaAWwH9vwfDriS0iSA6Qvm/Walmart-Sparkathon?node-id=1-269&t=KhCtkH31Df4SoaB7-1
- Demo Link : https://drive.google.com/file/d/10Uw3--fMD4ep7aTU7vlTTN18rfMu3Sry/view?usp=sharing

We have developed a NextJS- Tailwind based Admin Dashboard frontend which displays several crucial global parameters like revenue impact, some global KPIs, total supply risk alerts, etc. It shows the current high, medium and low demand products separately and displays a suggested stock purchase for all items in the database and features individual and batch prediction functionalities as well. A graph demonstrates the upcoming 14 day demand trend pictorically.

The backend contains an ML model that uses popular libraries like sci-kit learn, numpy, pandas, etc. It uses a Gradient Boosting Regressor to predict future demand. The several features involved in training the model include time related data(month/ day), historical sales trends, event (festivals/sales, etc) flags, external factors like temperature, etc. To predict, we enter sales history and current stock. The output includes
- A 14 day forecast
- Risk level (critical to low)
- Top factor affecting demand (reason of spike)

Overall, by ensuring the database is updated with relevant products, the admin can easily maintain a good stock of all products based on upcoming demand spikes; hence minimising losses, maximising revenue, and upholding retailer standards!
