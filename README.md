# rest-jenkins

a [Sails](http://sailsjs.org) application

# Environment Variables
The following environment variables must be set:

## Database (MySQL):
mysql_host (localhost)
mysql_user (root)
mysql_password (root's password)

## LDAP:
ldap_url (ldaps://ldap.example.com:636)
ldap_adminDn (uid=myadminusername,ou=users,o=example.com)
ldap_password (myadminusername's password)
ldap_searchBase (ou=users,o=example.com)