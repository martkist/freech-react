cd freech-core
docker run -d -p 4032:4032 -v /root/.freech:/root/.freech -v /root/freech-react:/root/freech-react martkist/freechd:v0.9.35 -htmldir=/root/freech-react -rpcthreads=100
cd ..

cd freech-proxy
forever start freech-proxy.js &
cd ..
