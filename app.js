const express = require("express");
var cors = require('cors');

const Clientes = require('./models/Clientes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
    app.use(cors());
    next();
});


app.get("/", async(req, res) => {
    res.send("Página Inicial");
});

//CADASTRA CLIENTE
app.post("/clientes", async(req, res) => {
    const resp = req.body

    var exec = require('child_process').exec;
    const test = `whois -h whois.registro.br AS${resp.asinformado} | egrep 'owner:|ownerid|inetnum' `

    const execRun = (cmd) => {
        return new Promise((resolve, reject) => {
          exec(cmd, async (error, stdout, stderr) => {
            if (error) {
              if (error.code === 1) {
                // leaks present
                resolve("Comand ERROR");
              } else {
                // gitleaks error
                reject(error);
              }
            } else {
                dono = stdout.substring(stdout.indexOf("owner:") + 13, stdout.indexOf("\n"));

                var regexp = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/gi;
                const doc_cnpj = stdout.match(regexp);
                //console.log("Dono:" + dono + "\n" + "CNPJ: " + doc_cnpj);

                v4 = null;
                regexp = /(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])+(\/)+([0-9]{1,2})/gi;
                v4 = stdout.match(regexp);
                v4_final = null;
                if(v4 != null){
                for (i = 0; i < v4.length; i++) {
                    if (v4_final == null) {
                       v4_final = v4[i];
                    } else {
                       v4_final = v4_final + " " + v4[i];
                    }
                }}
                console.log("IPv4: " + v4_final);

                v6 = null;
                regexp = /(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?=(?:[0-9A-Fa-f]{0,4}:){0,7}[0-9A-Fa-f]{0,4}(?![:.\w]))(([0-9A-Fa-f]{1,4}:){1,7}|:)((:[0-9A-Fa-f]{1,4}){1,7}|:)|(?:[0-9A-Fa-f]{1,4}:){7}:|:(:[0-9A-Fa-f]{1,4}){7})(?![:.\w])+\/+([0-9]{1,3})/gi;
                v6 = stdout.match(regexp);
                v6_final = null;
                if(v6 != null){
                for (i = 0; i < v6.length; i++) {
                    if (v6_final == null) {
                        v6_final = v6[i];
                    } else {
                        v6_final = v6_final + " " + v6[i];
                    }
                }}
                console.log("IPv6: " + v6_final);

                asfinal = "AS" + resp.asinformado;

                if (resp.path != 'null') {
                    aspaths = resp.path.substring(0, resp.path.indexOf('$') - 1) + "+(" + resp.asinformado + "_)+$";
                    //console.log("Entrou: " + aspaths);
                } else {
                    aspaths = "^(" + resp.asinformado + "_)+$";
                    //console.log("Nao Entrou")
                }

                //console.log('INSERT iniciado');
                var final = ({ owner: dono, cnpj: doc_cnpj[0], asnumber: asfinal, ipv4: v4_final, ipv6: v6_final, aspath: aspaths });
    
                resolve(final);
            }
        })
    })
    };
    
    (async () => {
        try {
            testing = await execRun(test);
            console.log("Saiu");
            await Clientes.create(testing).
            then(() => {
                return res.json({
                    erro: false,
                    mensagem: "Cliente Cadastrado com Sucesso"
                });
            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Ocorreu um erro ao cadastrar"
                });
            });
        } catch (e) {
            console.log("falha")
        }
    })()
});

//Update
app.put("/clientes/:update", async(req, res) => {
    const resp = req.body

    var exec = require('child_process').exec;
    const test = `whois -h whois.registro.br ${resp.asinformado} | grep inetnum `

    const execRun = (cmd) => {
        return new Promise((resolve, reject) => {
          exec(cmd, async (error, stdout, stderr) => {
            if (error) {
              if (error.code === 1) {
                // leaks present
                resolve("Comand ERROR");
              } else {
                // gitleaks error
                reject(error);
              }
            } else {
                v4 = null;
                regexp = /(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])+(\/)+([0-9]{1,2})/gi;
                v4 = stdout.match(regexp);
                v4_final = null;
                console.log(v4);
                if(v4 != null){
                for (i = 0; i < v4.length; i++) {
                    if (v4_final == null) {
                       v4_final = v4[i];
                    } else {
                       v4_final = v4_final + " " + v4[i];
                    }
                }
                }

                v6 = null;
                regexp = /(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?=(?:[0-9A-Fa-f]{0,4}:){0,7}[0-9A-Fa-f]{0,4}(?![:.\w]))(([0-9A-Fa-f]{1,4}:){1,7}|:)((:[0-9A-Fa-f]{1,4}){1,7}|:)|(?:[0-9A-Fa-f]{1,4}:){7}:|:(:[0-9A-Fa-f]{1,4}){7})(?![:.\w])+\/+([0-9]{1,3})/gi;
                v6 = stdout.match(regexp);
                v6_final = null;
                if(v6 != null){
                for (i = 0; i < v6.length; i++) {
                    if (v6_final == null) {
                        v6_final = v6[i];
                    } else {
                        v6_final = v6_final + " " + v6[i];
                    }
                }}

                var final = ({ ipv4: v4_final, ipv6: v6_final });

                resolve(final);
            }
        })
    })
    };
    
    (async () => {
        try {
            testing = await execRun(test);
            await Clientes.update(testing,{where:{asnumber: resp.asinformado}}).
            then(() => {
                return res.json({
                    erro: false,
                    mensagem: "Cliente atualizado com Sucesso"
                });
            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Ocorreu um erro ao atualizar"
                });
            });
        } catch (e) {
            console.log("falha")
        }
    })()
});


//Listar
app.get("/clientes", async(req, res) => {
    await Clientes.findAll({
            attributes: ['id', 'owner', 'cnpj', 'asnumber', 'ipv4', 'ipv6', 'aspath'],
            order: [
                ['aspath', 'DESC'],
            ]
        })
        .then((clientes) => {
            const ListaClientes = clientes;
            return res.json({
                clientes
            })
        }).catch(() => {
            return res.status(400).json({

                mensagem: []
            });
        });
});


//Listar apenas um AS
app.post("/clientes/:as", async (req, res) => {
    const resp = req.body

    //await User.findAll({ where: { id: id } })
    await Clientes.findAll({
        attributes: ['id', 'owner', 'cnpj', 'asnumber', 'ipv4', 'ipv6', 'aspath'],
        order: [
            ['aspath', 'DESC'],
        ],
        where: {
            asnumber: resp.asinformado
        }
    })
    .then((clientes) => {
        const ListaClientes = clientes;
        return res.json({
            clientes
        })
    }).catch(() => {
        return res.status(400).json({

            mensagem: []
        });
    });
});

app.delete("/delete", async (req, res) => {
    const {aspathdelete} = req.body;

    console.log(aspathdelete);

    await Clientes.findAll({
        attributes: ['id', 'aspath'],
    })
    .then(async (clientes) => {
        const DeleteClientes = clientes;
        for (i = 0; i < DeleteClientes.length; i++) {
            teste = DeleteClientes[i].aspath.substring(0, (aspathdelete.length - 1));
            if (aspathdelete.substring(0, (aspathdelete.length - 1)) == teste) {
                id = DeleteClientes[i].id;
                //console.log(id);
                await Clientes.destroy({ where: { id } });
            };
        };
    });

    return res.json({
        erro: false,
        mensagem: "Cliente deletado com Sucesso"
    });

});


app.listen(3002, () => {
    console.log("Tudo ok");
});