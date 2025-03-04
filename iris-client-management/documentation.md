# Iris Documentation

## Overview
This documentation provides detailed information about the system's endpoints and their functionalities. The system is designed to manage client relationships, track sales, and administer user permissions.

## Endpoints

### `/reception`
**Purpose:** Entry point for new client registration by the sales team.

**Functionality:**
- Sales team members fill in details of new clients
- Captures essential client information such as:
  - Full name
  - Contact information (phone, email)
  - Company details
  - Initial requirements
  - Source of lead
- Creates a new client record in the system
- Forwards client information to the appropriate sales representative

-- More detailed on the UI for reception

regsitration of clients follows a convention of 
- M/year/month/cleintID

for this case,,, the values of couurse will change as we move to the next month or year,, the M stands for Moi Avenue in htis case,, so in cases where company has differnet branch lets sya another branch in Kisumu can ba K/2025/Month/ID 

**Access:** Sales team members

### `/sales`
**Purpose:** Management of client sales information.

**Functionality:**
- Record sales details for each client
- Document products/services sold
- Track pricing information
- Record payment details
- Maintain sales history
- Generate sales reports
- Track follow-up actions

**Access:** Sales representatives --> when product becomes big we can scale down to access controls

### `/clients`
**Purpose:** Comprehensive view of all registered clients.

**Functionality:**
- Displays all clients registered in the system
- Shows detailed client information including:
  - CLients details
  - Contact information
  - Sales history
  - Engagement timeline
  - Pending collection, Pending balance
  - clients sales details /history of purchase too
- Allows filtering and searching
- Enables export of client data
- Supports updating client information

**Access:** Sales team and management
### /clients/client?id=1
- COntains cleints history cleints infromation
- prescription history

### `/existing-clients`
**Purpose:** View of legacy clients not yet migrated to the new system.

**Functionality:**
- Shows clients from previous systems or records
- Displays available information for legacy clients
- Provides functionality to migrate clients to the new system
- Highlights clients requiring data completion
- Tracks migration progress

**Access:** Sales team and management

### `/admin`
**Purpose:** System administration and user management.

**Functionality:**
- User management:
  - Create new employee accounts
  - Assign roles and permissions
  - Deactivate accounts
  - Reset passwords
- System configuration:
  - Customize fields
  - Set up workflow rules
  - Configure notification settings
- Data management:
  - Perform data backups
  - Generate system reports
  - Monitor system usage
  - data analytics
- Access control:
  - Define role-based permissions
  - Manage department access

**Access:** System administrators

## Administrative Capabilities

The admin role has the following specific capabilities:

1. **Employee Management**
   - Create new employee accounts
   - Assign specific roles (sales, manager, reception, admin)
   - Set permission levels for each employee
   - Deactivate accounts for former employees
   - Reset employee passwords

2. **System Configuration**
   - Customize form fields
   - Configure workflow rules
   - Set up automated notifications
   - Define required fields for different processes

3. **Reporting and Analytics**
   - Generate system usage reports
   - Access sales performance metrics
   - Monitor client acquisition rates
   - Track system adoption

4. **Data Oversight**
   - Perform data audits
   - Manage data integrity
   - Oversee client data migration
   - Implement data security protocols

5. **Access Control**
   - Define which roles can access specific endpoints
   - Set up department-level access restrictions
   - Create custom permission groups
   - Monitor login activities( not must)


--> some features are not a must as of now,,, we can build the working MVP