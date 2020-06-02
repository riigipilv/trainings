# Kubernetese klastri nõuded

Iga kasutaja vajab klastris oma kasutajat ja täisõigustega namespace'i.
Lisaks peab iga kasutaja pääsema Read-Only õigustes ligi `kubeless` ja `openfaas` namespace'idele.

Peaks ära installima ka OpenFaaSi ja Kubeless komponendid, mis ei lähe kasutaja enda namespace'i.

On ka vaja mingit (võimalikult lihtsat) Docker registrit, kuhu iga kasutaja saab faile üles laadida.
