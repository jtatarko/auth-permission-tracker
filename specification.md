# Authorizations: added/removed permissions tracking app demo

In the ETL platform like Adverity, users have authorization objects enabling them connection between data source (Meta, Google Ads, Amazon, etc.) and data pipelines in Adverity.
Each authorization object can have access to selected campaigns, data. In Adverity, this is called a permission. Those permissions can be added or removed without action of user in Adverity, e.g. when a campaign is deleted in the data source.
Tracking those changes of permission in Adverity is important for its users. Let’s create a demo of UI and flow that will be used for user testing. Create dummy data representing marketing data collected from a different data sources like Meta, Google Ads, Amazon, etc. No backend needed.

Beginning of the flow: users are notified via email notification send once a day where they see  in a table what permissions of authorization for a data source are removed and added.

![image.png](attachment:91c29029-3153-4f26-90a6-b8f2aeb19553:image.png)

By clicking on “See details”, users are redirected on the specific page of authorization in Adverity ETL, called authorization detail with a drawer opened. 

![image.png](attachment:65759745-bbca-4fef-8a8f-8113e2f88d5b:image.png)

That drawer lists the same permission changes for the give time period form the email (e.g. from 05:00, 18/08/2024 to 05:00 19/08/2024). User can export data in the list based on selected filters in csv.
The table contains the following columns: 

![image.png](attachment:196e8c1e-6b77-4214-9dba-37d02b408ec6:image.png)

Clicking on backdrop of the drawer with the list of permission changes, user sees an authorization detail page that, e.g. for Amazon Ads has the following content: 

![image.png](attachment:614e9714-d1da-4d21-94ab-53cbc6e00894:image.png)

The drawer with the list of permission changes can be opened from the authorization detail page by clicking on “View changes” button.

Eventually user can go to the page where all authorizations available to Adverity user in a workspace are listed.

![image.png](attachment:daf1882a-a5b2-4f91-ad25-24417dd1e00d:image.png)

On this authorizations page, users can also see a stacked chart showing added (light blue) and removed (yellow) permissions for a selected time period.

Users can also filter the list and select by clicking on checkbooks, multiple authorizations to do action for that selection (in a bulk) as you can see in the example:

![image.png](attachment:1289b2bf-65aa-4754-acfb-adc11403fdb3:image.png)

By clicking on “Export permissions” dropdown opens and there, when users click on “Permission changes” the modal opens where users can select date range and if they want to export Added, Removed or both permissions into csv.

![image.png](attachment:c8fbb824-99da-45aa-ba08-24389b7e4dbd:image.png)

The demo should run in a browser via [localhost](http://localhost). For UI we could use https://ui.shadcn.com/.