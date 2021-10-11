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

### k8s deployment

The kubernetes deployment can be accessed at ip: 169.51.194.186

User-Server is on port: 30960

Fibonacci-Server is on port: 31166

Authoritative-Server is on port: 31870

The root of the User-Server and the Fibonacci-Server will list its name in the browser

### Notes to me:

A note for posterity when working with IBM Kubernetes services:

first login to imb cloud:

```ibmcloud login -a cloud.ibm.com -r eu-de -g Default```

target the cluster:

```ibmcloud ks cluster config --cluster <cluster-name/ID>```

confirm connection to cluster:

```kubectl config current-context```

finding the public IP:

```ibmcloud ks worker ls --cluster <cluster-name/ID>```

where the cluster id is listed from the console section for the kubernetes cluster

listing the kubernetes services:

```kubectl describe services```

this is the network service described in the service yaml

finding the random ports assigned to the deployment:

```kubectl describe service <service-name>```
