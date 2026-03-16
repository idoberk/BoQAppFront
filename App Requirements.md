# Base44 Initial

# Base 44 app language, modified after manual review

Create a bill of quantities app that will have the following features:

1. Each boq is a table containing 6 columns \- item number, item description, quantity, quantity unit, unit cost and total cost.  
2. Each boq is in a project folder categorised by the following:  
- Project name  
- Project number  
- Project type?? : Road construction, lift station build, waterline rehabilitation etc. Custom types can be added to user’s list

  Projects should be able to contain multiple project types

- Project location: state, county, city/village (complete list/free fill)  
- A designated project manager: designated project manager assigns project to design engineer.  
3. User account data to be stored in a cloud. Database for user account using work email alone.  
4. Desktop application \- relies entirely on user network security and data backup.  
5. A project can have multiple of boqs with a designated active. Boqs can be copied. Ability to import and export from excel. Export as excel or PDF for contractor bid can be done at any status.   
   Version control for boq not required.   
6. Each boq will have a protocol of review by the project manager from which the boq’s status will be changed to approved. Unapproved boq will be labeled “in review” and boqs sent for bid will have a status of final bid.  
7. Custom user template for boq print with user company logo.  
8. Each project will have a boq with will be the actual bid cost from contractors that the engineer will enter into the app. The contractor's bid is to be compared with the “for bid” boq with statistical analysis of unit cost deviation and total cost margins. Only one BOQ can have the for bid status.  
9. For bid approved boq is automatically exported to the bidding tab.  
10. Analysis should include contractor cost estimate unit cost average and %margin deviation from design engineer’s estimate.

# Requirements

# Requirements

## Background and terminology

*Provide the context for the app and introduce the terms (names) we are going to use and how they relate to each other.*

**Engineering Consultantancy Firm (ECF):** Hired by a **ECF Client (**in short **Client)** to prepare a Bill of Quantities for his **Project**, mostly construction projects.  
**Contractor**: executes the project.  
**Bill of Quantities** (**BOQ**): a comprehensive document in table form listing all measured items, materials, and labor with their quantities and estimated costs for a project, hence BOQ is also known as **Cost Estimate.**  
There are 3 kinds of BOQ with respect to the costs:

1. **Design BOQ**: this is created by the design consultancy firm and has the prices estimated by the **Design Engineer**.  
   1. **Candidate BOQ** is the BOQ which is the process of being worked upon.  
      Once it is *approved* by the **Project Manager (PM)**  it becomes the Design BOQ.   
2. **Tender BOQ**: this is the Design BOQ without the prices, published by the Client to the Contractors.  
3. **Contractor’s Bid BOQ**: This is the Tender BOQ with prices filled in by the Contractor according to his estimation. Usually, the lowest Bid BOQ that is within acceptable range of the Design BOQ is the one which wins the project, called the **Selected Contractor’s Bid BOQ**.

## Description of functionality and advantages

*Provide the functions of the app \- what it does and the advantages to provide to its users over the current working methodology.*

Bill of Quantities (BOQ) application used for:

1. Creating Design and Tender BOQs in a streamlined way that reduces errors.  
2. Comparing Tender BOQ with Selected Contractor’s Bid BOQ to provide a retrospective analysis of the BOQ creation process.  
3. Storing all BOQs in an easily accessible way under projects that also enables creating BOQs for new projects from old BOQs to speed up the BOQ creation process.

Advantage compared to competitors:

1. Competitor apps provide a lot of extra functionality which is not used, and their pricing is proportionally higher, hence are not used by many companies.  
   Our App is to provide the necessary used functionality only at a reduced price, thus we can sell to more companies.

Future Possible Functionalities to consider:

1. Integration with external project management, such as Deltek.

## App Requirements Specifications

*Provide exactly what the app is supposed to do, the inputs and outputs (data fields and types), the storage (data structures and relationships) and the processes (data transformations).*

General specifications:  
App should be designed with flexibility. All attributes (except the identifiers and Name) should be dynamic and possible to be changed by the user admin.  
Currently code with current attributes, but software architecture should enable that flexibility for later phases of product development.

Elements modeled: User, Project, BOQ

User : This models the users.

1. Each user that can access the app will have the following attributes:  
   1. Name  
   2. Company email  
2. There are no predetermined roles for each user, during project creation, roles are assigned per project.   
3. Roles:  
   Each user can have a number of roles (like a checkbox per role)  
   1. Admin: classical admin \- manages software, and can assign different roles to users.  
   2. Project Manager (PM) responsible for projects:  
      1. can create, update and delete projects.  
      2. Assigned to a project as project manager  
         1. Approves draft BOQ to design BOQ in that project  
   3. Design Engineer: responsible for BOQs: can create, update and delete BOQs  
   4. Viewer: read only permissions, can search and view projects, and BOQs. 

Project : this models a project that the company is handling.

1. Project created by user=Project Manager with the following attributes:  
   1. Name \[string\]  
   2. Description \[string\] : free form description of the project  
   3. Job Number \[string\]: usually created by an external project management app.  
   4. Type \[list:string\] : indicate what the project is about.  
      A Project can have multiple types, types can be selected from initial list, or new custom user defined types entered during creation that will be added to list.  
      E.g.: Road construction, lift station build, waterline rehabilitation  
   5. Location \[tuple:string\]: state, county, city/village  
      Select from database if possible \- examine using 3rd party open source DB.  
   6. Not needed: Client Info.  
2. Project has an assigned PM, which is the PM who created it, it can assigned to another PM by any other PM.  
3. Project attributes can be edited by assigned PM  
4. Project can be deleted by any PM.  
5. Project search parameters:  
   1. can be searched for according to any of its attributes.  
   2. can be searched for according to range of design BOQ total cost.  
6. Project can have multiple Candidate BOQs.   
   Reason: While engineer is working on a BOQ, project parameters may change, and one may want to work on a new version of the BOQ, so the engineer stops working on BOQ, and starts working on a new BOQ.  
7. BOQ can be created in a project or copied from another BOQ in the same project or copied to the project from BOQ in another project. BOQ can also be imported from an excel (see BOQ).  
8. Currently, no design engineers assigned to project., so any engineer can edit BOQs under project.  
9. Project workflow:  
   1. BOQ has three statuses: “Draft”, then Engineer can move it to ”In review”, then the PM approves it and moves to “Approved”.  
      Note: BOQ does not have version control, but has automatic save, including of the user who made the last edit.  
   2. The PM will select which of the “Approved” BOQs will be the Design BOQ for the project.  
   3. Engineer or PM can later add Bid BOQ from the customer ()several, each per contractor) to the project and the app will compare it with the Design BOQ and provide an analysis (see BOQ comparison under BOQ)

BOQ: used to estimate the cost of a project.

1. BOQ has the following attributes  
   1. Parent project  
   2. Name  
   3. Description  
   4. Engineer(s) in case we decide to add design engineers per BOQ  
2. BOQ creation, update, deletion by any user.  
3. BOQ has a table for the cost estimation with rows as the items involved in the project.  
   Currently these items are entered in free form text by user and not selected from a database. Reason: Standardization is per location, extra effort of of learning the catalogue per each location might be too much work for the app and is not the main functionality, it will add unnecessary cost to the app, engineer can learn and work with the standard as he normally does before using the app. However, consider it for future development as added value if the cost is reasonable.   
   Columns in the table are as follows:  
   1. Item number \[string\]: entered by user  
   2. Item description \[string\]: entered by user  
   3. Unit \[string\]: entered by user  
   4. Quantity \[number\]: entered by user, number of units  
   5. Unit cost \[number\]: entered by user  
   6. Cost \[number\]: calculated by app as Quantity x Unit cost.  
4. BOQ will also have the total cost which is the sum of the items’ costs.  
5. BOQ can be exported to excel/csv/pdf and imported from an excel/csv which matches the format in the export, for this purpose, app should supply template csv/excel for download.  
   1. Exported BOQ to excel/pdf should contain in addition to the table the following:  
      1. ECF logo  
6. BOQ can be exported as a Tender BOQ excel/pdf where by the unit cost per item is blank (and so automatically the cost per item)  
   This can be done for any Candidate BOQ, not only the selected Design BOQ.  
7. App should be able to compare two BOQs as Design and Bid BOQs.  
   First, app should verify that tables contain the same items (number, description, unit, quantity).  
   1. And for the unit cost, it should provide the following metrics per item:  
      1. bid unit cost deviation from design  
      2. Others?   
   2. Global metrics?  
8. No need to be able to search for individual BOQs.  
   Reason: Search parameters are per project, and BOQ is representative of the project.  
   Limitation: In case project type changes, and BOQ changes accordingly, cannot access the old \[un\]completed BOQ by search.  
9. Users can add comment threads to BOQ per item, especially useful for the review.

Notifications

1. When BOQ is sent for approval, notification sent to PM.  
2. When PM approves, notification sent to the Design Engineer who submitted for review.  
3. When comment is added on BOQ, to comment thread participants.

   

# Software Architecture

## Software Architecture

### Application Type

Webapp (instead of desktop/mobile app) chosen for the following reasons:

1. More accessible to users (does not require installation and upgrades)  
2. faster development and no need for app deployment bureaucracy vis-avis app marketplace.

### Security

1. Webapp accessed through company vpn or internal network.  
2. User management. Users added using Single Sign-On (SSO) with the company's Identity Provider (IdP) preferably, orif that cannot work at the moment, then  users added using company email and we store password.  
3. 

# Technology Stack

# Frontend

## JavaScript:

### **Pros:**

* All team members are familiar with the language.  
* Flexible.  
* Faster development compared to TypeScript.

### **Cons:**

* No compile-time type checking (but irrelevant with good coding and tests).

## React:

### **Pros:**

* Largest ecosystem.  
* Team familiarity.  
* Stable and reliable.  
* Fast.

### **Cons:**

* 

## Vite:

### **Pros:**

* Quick build times.  
* Regularly updated and well supported.  
* Fast development server.

### **Cons:**

* a

## React Compiler:

### **Pros:**

* Eliminates the need to manually write useCallback and useMemo.  
* Cleaner code.  
* Future proof.

### **Cons:**

* New.

## MUI:

### **Pros:**

* Extensive documentation and large community.  
* Stable.  
* One of the oldest and most established React UI libraries.

### **Cons:**

* .