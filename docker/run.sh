cd freech-core
docker run -d -p 28332:28332 -v /root/.freech:/root/.freech -v /root/freech-react:/root/freech-react martkist/freech-core -htmldir=/root/freech-react -rpcthreads=100
cd ..

cd freech-proxy
forever start freech-proxy.js &
cd ..
