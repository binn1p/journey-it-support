# Section 2
- Workgroup: no server, require account to sign in -> home laptop, my pc
- Domain: a server, dc, is required, user acc are stored in AD

What is a workgroup network and how does it differ from a domain network?*
- A workgroup is a small network of computers that are connected and share resources (printers, files). Each computer has its own account and can access its resources. A domain network is a network of computers that are connected and controled by a central server called domain controller. DC handles user authentication and controls access to resources.

*In what types of environments are workgroup networks typically used?*
- Workgroup networks are typically used in small office and home office environtment where there is no need for centralized management of resources and user authentication.

*How does a workgroup network handle user authentication and resource access!*
- In workgroup network, each computer has its own user account and access to its resources. To access to others resources, it is required to have permission and account on that computer.

*What are the advantages and disadvantages of using a workgroup network?*
- One advantage of using workgroup network is that it is simple to setup and mange, suiting small to personal sized office. However, one disadvantage of using workgroup network is that it can be more time consuming to manage user authentication and permission to resource access, as it must be set up and congfig seperately on each computer.

*How does a domain network differ from a workgroup network in terms of user authentication and resource access*
- In a domain network, the domain controller handles user authentication and controls access to resources. Users log in to the domain with a single set of credentials, and the domain controller determines their access to resources based on their user account and group membership. In a workgroup network, each computer has its own user accounts and controls access to its resources.

*Can you provide an example of when it might be more appropriate to use a domain network over a workgroup network?*
- A domain network might be more appropriate in a larger organization where there are many computers and users, and where there is a need for centralized management of resources and user accounts. For example, a domain network might be used in a school or a business with multiple departments and locations.

*How does a domain network support centralized management of resources and user accounts?*
- In a domain network, the domain controller handles user authentication and controls access to resources. This allows for centralized management of user accounts and permissions, as these can be set up and maintained in a single location rather than on each individual computer. Additionally, resources such as printers and file servers can be centrally managed and accessed by users across the network.

- 
