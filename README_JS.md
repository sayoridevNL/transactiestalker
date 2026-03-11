# 💰 Budget Tracker: The Ultimate Technical Explainer

Welcome to the full documentation for the **Budget Tracker**. This application is a high-performance, client-side financial tool built to manage transactions, track recurring subscriptions, and forecast future expenses using a "Privacy-First" local architecture.

If you are just starting with JavaScript, this guide will walk you through the core concepts used in this project.

---

## 🏗️ 1. Core Architecture: The Single Page Application (SPA)

This app follows an **SPA (Single Page Application)** pattern. Instead of loading different `.html` files for every page, it stays on one page and uses JavaScript to swap views.

### How Navigation Works (The DOM)

The interface is divided into three areas: **Transacties**, **Abonnementen**, and **Komende betalingen**. We manage these by manipulating the **DOM (Document Object Model)**.

* **The Mechanism:** Every tab button has a custom `data-tab` attribute (e.g., `data-tab="subscriptions"`).
* **The Logic:** When clicked, a JavaScript `forEach` loop runs. It removes the `active` class from every content `div` and adds it only to the one you selected.
* **The Code Concept:**
    ```javascript
    // We toggle visibility by adding/removing CSS classes
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    ```

---

## 💾 2. Local Storage: Your Browser's "Filing Cabinet"

Because this app has no database server, it uses the **Web Storage API**. This is a small storage space inside your browser that stays even if you refresh the page.

### The Serialization Process

Local Storage can **only store text (strings)**. It cannot store JavaScript Arrays or Objects directly. We use two methods to fix this:

1.  **Saving (`JSON.stringify`):** Converts your Array of data into a long string of text.
2.  **Loading (`JSON.parse`):** Converts that text back into a live JavaScript Array so we can calculate totals.

**The Data Keys used in this app:**
* `my_tasks`: Stores historical income and expenses.
* `my_subs`: Stores subscription templates.
* `my_upcomings`: Stores planned future payments.

---

## 📝 3. The "Smart" Form Logic

The app uses a clever trick to handle both **Adding** and **Editing** within the same form. This prevents us from having to write the same code twice.

### The Hidden Index Trick

In the HTML, we have a hidden input: `<input type="hidden" id="editIndex" value="-1">`.

* **Adding:** When you submit, if the value is `-1`, the script knows this is new and uses `.push()` to add it to the list.
* **Editing:** When you click "Edit," JavaScript fills the form with the old data and changes the `editIndex` to that item’s position (e.g., index `2`).
* **The Save:** The script sees the `2`, recognizes you are editing, and overwrites the data at that specific spot in the array instead of creating a duplicate.

---

## 🔄 4. The Subscription Engine (`Abonnementen`)

Subscriptions act as "Templates" for recurring costs. We use the **JavaScript Date Object** to handle the calendar math.

### The "Pay" Mechanism
When you click **"Betaald" (Paid)**:
1.  **History:** The app copies the subscription data into your main transaction history.
2.  **Date Math:** It checks the interval (`monthly` or `yearly`). It uses `.getMonth()` or `.getFullYear()`, adds `1`, and saves the new date back to the subscription.
3.  **The Update:** The "Next Date" refreshes automatically so you're ready for next month.

---

## 🔮 5. The 30-Day Forecast (`Komende betalingen`)

This is the most advanced logic in the app. It creates a **Virtual Timeline** of your financial future.

### How the Projection Works:
* **Scanning:** It looks at every subscription. If a billing date falls between **Today** and **30 Days from now**, it adds it to the list.
* **Time Math:** JavaScript calculates the difference in **milliseconds** between "Now" and the "Due Date."
* **Human Labels:** We divide those milliseconds to get days and display:
    * 0 days = **Vandaag**
    * 1 day = **Morgen**
    * \>1 day = **Over X dagen**

---

## 🎨 6. UI/UX & Visual Styles

The app uses a **High-Contrast Neon-Dark Theme** for clarity.

* **Dynamic Summary:** The "Inkomsten" and "Uitgaven" boxes update in real-time using the `.reduce()` method to sum up your totals.
* **Auto-Sorting:** We use `.sort()` to make sure your transactions always appear in order, even if you enter an old receipt today.
* **Visual Cues:** CSS classes are added dynamically: Green for income, Pink/Red for expenses.

---

## 🛠️ 7. Maintenance & Troubleshooting

### How to Reset the App
If you want to clear all data and start fresh, open the **Browser Console** (`F12` or `Inspect` -> `Console`) and run:

```javascript
localStorage.clear();
location.reload();