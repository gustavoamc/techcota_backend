require('dotenv').config(); // loads .env

const makeLayout = (budget, user/*, logoPath*/) => { //TODO parei aqui (parte 1)
    const { generalVision, proposal, startDate, endDate, ratesUsed, hoursAndValues, installments } = budget
    const {companyName, address, cnpj, contactPhone, contactEmail, website, logo} = user.settings

    const translation = {
        maintenance: 'Manutenção',
        creation: 'Criação',
        development: 'Desenvolvimento',
        integration: 'Integração',
        extra: 'Extra'
    }

    const table = Object.keys(hoursAndValues).reduce((acc, key) => {
        if (key.includes('Hours')) {
            let service = key.replace('Hours', '');
            acc.push({
                service: translation[service],
                hours: hoursAndValues[key],
                rate: ratesUsed[service],
                serviceTotal: hoursAndValues[key.replace('Hours', 'Value')],
            });
        }
        return acc;
    }, []);

    budgetTotal = table.reduce((acc, item) => acc + item.serviceTotal, 0);

    actualDate = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    htmlLayout = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                html, body {
                    font-family: Arial, Helvetica, sans-serif;
                    margin: 0;
                    padding: 16px 4%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                h1 {
                    font-size: 42px;
                    margin-bottom: 4px;
                    padding-bottom: 0;
                }
                table, tr, td, th, div {
                    page-break-inside: avoid;
                }
                table, tr, th, td {
                    border-spacing: 0;
                    margin: 0;
                    border: 1px solid #000;
                    text-align: start;
                }
                th, td {
                    padding: 8px 24px;
                }
                #tableTitle {
                    font-size: 28px;
                    font-weight: bold;
                    text-decoration: underline;
                }
                .headerSubtitle {
                    margin: 0 0 16px;
                    font-weight: normal;
                }
                .headerList {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .headerList img {
                    max-width: 175px;
                    max-height: 175px;
                }
                .headerText {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: left;
                    margin-left: 16px;
                }
                .headerText h4 {
                    font-weight: normal;
                    margin: 4px 0;
                }
                .centralize {
                    text-align: center;
                }
                .rightAlign {
                    text-align: right;
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    text-decoration: underline;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .subtitle {
                    text-align: center;
                    font-size: 10px;
                }
                .subtitle ul, li {
                    text-align: start;
                    margin: 0;
                    padding: 0;
                }
                .bold, .subtitle span, td span {
                    font-weight: bold;
                }
                .subtitle p {
                    text-decoration: underline;
                }
                .paragraph {
                    margin-top: 0;
                }
            </style>
        </head>
        <body>
            <div class="headerList">
                <div><img src="${process.env.API_URL}/logos/${logo}" alt="Logo da empresa"></div>
                <div class="headerText">
                    <h3>${companyName}</h3>
                    <h4>${cnpj}</h4>
                    <h4>${address}</h4>
                    <h4>${website}</h4>
                    <h4>${contactEmail}\t${contactPhone}</h4>
                </div>
            </div>
            <h1>Proposta Comercial de Serviço</h1>
            <h2 class="headerSubtitle">${actualDate}</h2>
            <p>
                Prezado cliente,<br><br>
                Venho por meio deste, apresentar a proposta comercial para a execução do serviço solicitado.<br>
                A proposta apresentada será realizada em um tempo fixo prescrito logo abaixo com alterações preestabelecidas, portanto nada será alterado em quaisquer necessidades requisitadas.<br>
                Em caso de dúvidas, entre em contato via WhatsApp ou ligação: <span class="bold">${contactPhone}</span><br>
                Ou então por nosso e-mail: <span class="bold">${contactEmail}</span><br>
                Não se esqueça também de acessar nosso site: <span class="bold"><a href="${website}" target="_blank">${website}</a></span><br>
                Sem mais, desde já agradeço a preferência.<br>
                Atenciosamente, <span class="bold">${companyName}</span>.
            </p>
            <div>
                <h3 class="title">Visão Geral</h3>
                <p class="paragraph">
                    ${generalVision}
                </p>
            </div>
            <div>
                <h3 class="title">Proposta</h3>
                <p class="paragraph">
                    ${proposal}
                </p>
            </div>
            <table>
                <caption id="tableTitle">Valores e Datas</caption>
                <tr>
                    <td colspan="4" class="centralize"><span>Data Inicial:</span> ${new Date(startDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'})} - <span>Data Final:</span> ${new Date(endDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}</td>
                </tr>
                <tr>
                    <th class="centralize">Serviço</th>
                    <th class="centralize">Quantidade de horas</th>
                    <th class="centralize">Valor por hora</th>
                    <th class="centralize">Total serviço</th>
                </tr>
                ${table.map((item) => 
                    `<tr>
                        <td>${item.service}</td>
                        <td class="centralize"><span>${item.hours}</span> horas</td>
                        <td>R$ <span>${item.rate.toFixed(2).replace('.',',')}</span></td>
                        <td class="rightAlign"><span>R$ ${item.serviceTotal.toFixed(2).replace('.',',')}</span></td>
                    </tr>`
                ).join('')}
                <tr>
                    <td colspan="3">
                        <p><span>Condições de pagamento: </span>À vista ou em até <span>${installments.length} vezes</span>, nas seguintes parcelas: ${installments.map((installment, i) => 
                            `<span>${i + 1}°:</span> R$ ${installment.toFixed(2).replace('.',',')} \t`
                        ).join('')}</p>
                    </td>
                    <td>
                        <p><span>Total: R$ ${budgetTotal.toFixed(2).replace('.',',')}</span></p>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" class="subtitle">
                        <h3>Legenda</h3>
                        <ul>
                            <li>
                                <p><span>Manutenção:</span> Referente a toda a manutenção feita em sistemas já existentes e envio para o servidor.</p>
                            </li>
                            <li>
                                <p><span>Criação:</span> Referente a toda a parte visual do site, assim como TEMA do sistema.</p>
                            </li>
                            <li>
                                <p><span>Desenvolvimento:</span> Referente a toda a lógica de programação e todas as regras de negócio.</p>
                            </li>
                            <li>
                                <p><span>Integração:</span> Referente a todas as integrações externas que serão consumidas dentro do sistema por vias de ligações e entre comunicações.</p>
                            </li>
                            <li>
                                <p><span>Extra:</span> Referente a todas as necessidades do projeto que não entrariam na questão do próprio desenvolvimento, como, por exemplo, valores de temas ou pagamentos de profissionais terceirizados.</p>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
    return htmlLayout
}

module.exports = makeLayout