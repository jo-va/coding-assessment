SELECT c.ID,
       c.NAME,
       a.ID AS ADDRESS_ID,
       a.STREET_ADDRESS,
       a.POSTAL_CODE,
       a.COUNTRY
  FROM Customers c
  INNER JOIN Customer_Addresses a
          ON a.CUSTOMER_ID = c.id;
