#!/usr/bin/fish

./server &
curl http://localhost:8080/Authorize?id=1&passw=cock
