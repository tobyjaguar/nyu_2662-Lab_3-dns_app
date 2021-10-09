# nyu_2662-Lab_3-dns_app
NYU 2662 Data Comms and Networks Lab #3 part 2 DNS Application

To run the docker containers, from the project directory:

```docker-compose up```

To make the Fibonacci call from the User Server:

```http://localhost:8080/fibonacci?hostname=fib.com&fs_port=9090&number=11&as_ip=dns-server&as_port=53533```

where 8080 is port forwarded to the User Server machine name (user-server)

the hostname of the Fibonacci Server, here, is fib.com, but can be whatever is registered

port of Fibonacci Server is 9090

number as desired, although, note that I capped the fib number at 2000

as_ip, here, is the Authoritative Server machine name, which docker resolves to ip

as_port is the udp port in which the dns query will be sent
