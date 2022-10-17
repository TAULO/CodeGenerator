import React from 'react'
import GameCard from './GameCard/GameCard'

import withAuthorization from './withAuthorization'

import "./Home.css"

const HomePage = () => 
    <div className="app">
      <h1 className="white">Home Page</h1>
      <center><p className="white">A página inicial é acessível por todos os usuários conectados.</p></center>
      <GameCard 
        name="1"
        extension="png"
        relevance={3}
        personage={0}
        event={2}
        title="Divisão de Mundos"
        text='O Imperialismo europeu foi uma política de expansão que buscou domínio territorial na África, Ásia, América Latina e Oceania.'
        question='Uma característica do Imperialismo é o etnocentrismo, que indicava que alguns povos eram superiores a outros. Por esse e outros motivos, houve uma divisão mundial, onde a Europa ficou conhecida como Ocidente e outros países como África e Ásia, que não apresentavam o sistema de vida europeu, ficaram conhecidos como Oriente.'
        answer="true"
        justification='Buscando legitimar a invasão e/ou a dominação exercida sobre esses povos, os países europeus elaboraram algumas teorias explicativas que justificassem a política imperialista. Dentre essas, uma das principais era a missão civilizatória dos europeus (civilizados) sobre os povos bárbaros.'
      />
    <p className="space"></p>
    <GameCard 
        name="2"
        extension="jpg"
        relevance={3}
        personage={0}
        event={3}
        title="Cortina de Ferro"
        text='O termo Cortina de ferro refere-se à fronteira que, a partir do fim da Segunda Guerra Mundial, dividiu a Europa ocidental do leste Europeu, região dominada pela União Soviética.'
        question='Na época, a expressão “Cortina de ferro” fazia uma metáfora sobre a influência americana na região da Europa Oriental e ressaltava o regime separatista na economia que existia entre o leste europeu e a economia capitalista.'
        answer="false"
        justification='A derrota da Alemanha na guerra originou a divisão da Europa em duas partes: a zona capitalista e a zona comunista. A Europa Oriental estava sob influência e controle político da União Soviética, enquanto a Europa Ocidental estava sob domínio dos Estados Unidos.'
      />
      <p className="space"></p>

    <GameCard 
        name="3"
        extension="jpg"
        relevance={4}
        personage={2}
        event={3}
        title="Corredor Polonês"
        text='A expressão refere-se à região transferida por parte da Alemanha para a Polônia ao fim da Primeira Guerra Mundial. O Corredor Polonês dividiu a Alemanha ao meio, isolando a Prússia Oriental do resto do país.'
        question='Para Hitler, invadir e tomar o corredor polonês era importante, pois a estreita faixa territorial poderia interligar a Prússia Oriental com a Alemanha novamente e por fim recuperar  os territórios que formavam o antigo império prussiano.'
        answer="true"
        justification='Um passo importante para Hitler era recuperar territórios que formavam o antigo império prussiano. Além disso, territórios poloneses separavam a Prússia Oriental do restante da Alemanha a partir do chamado corredor polonês. O objetivo alemão era, portanto, interligar novamente a Prússia Oriental com a Alemanha, realizando para isso a tomada de grande parte da região polonesa.'
      />
      <p className="space"></p>

    <GameCard 
        name="4"
        extension="jpg"
        relevance={3}
        personage={2}
        event={2}
        title="Tratado de Versalhes"
        text='O Tratado de Versalhes (1919) foi um tratado de paz assinado pelas potências europeias que encerrou oficialmente a Primeira Guerra Mundial.'
        question='O Tratado não impôs à Alemanha a perda de uma parte de seu território, nem de todas as colônias sobre os oceanos e sobre o continente africano. O acordo apenas impôs uma indenização pelos prejuízos causados durante a guerra.'
        answer="false"
        justification='Os termos impostos à Alemanha incluíam a perda de uma parte de seu território para um número de nações fronteiriças, de todas as colônias sobre os oceanos e sobre o continente africano, uma restrição ao tamanho do exército e uma indenização pelos prejuízos causados durante a guerra.'
      />
      <p className="space"></p>

    <GameCard 
        name="5"
        extension="jpg"
        relevance={3}
        personage={1}
        event={3}
        title="Conferência de Berlim"
        text='A Conferência de Berlim aconteceu entre novembro de 1884 e fevereiro de 1885 e delimitou regras e acordos durante a ocupação do continente africano pelas potências europeias.'
        question='O evento também conhecido como partilha da África oficializou o neocolonialismo que resultou na extensa exploração econômica de colônias africanas pelos países europeus.'
        answer="true"
        justification='A Conferência de Berlim foi resultado do surto neocolonialista. À medida que o capitalismo sofria transformações, surgiu como necessidade o impulso imperialista para dar continuidade na exploração de matérias-primas e mercados consumidores. O continente africano, então, foi um dos alvos da ambição das potências industrializadas europeias.'
      />
      <p className="space"></p>
   
    <GameCard 
        name="6"
        extension="jpg"
        relevance={4}
        personage={1}
        event={2}
        title="New Deal"
        text='O New Deal foi um conjunto de medidas econômicas e sociais tomadas pelo governo Roosevelt, com o objetivo de recuperar a economia dos Estados Unidos da crise de 1929.'
        question='Uma das medidas utilizadas durante o New Deal foi controlar bancos, instituições financeiras e econômicas, onde foram aumentadas as horas de trabalho com intuito de aumentar a produção e alavancar a economia estadunidense novamente.'
        answer="false"
        justification='No setor industrial, a principal medida foi a redução da jornada do trabalho, visto que o fator básico que gerou a crise econômica havia sido a superprodução. Com a redução do trabalho surgiu uma importantíssima inovação técnica — a linha de montagem. Essa inovação permitiu a redução dos custos e, sobretudo, aumento da produtividade.'
      />
      <p className="space"></p>

      <GameCard 
        name="7"
        extension="jpg"
        relevance={4}
        personage={0}
        event={3}
        title="Grande Depressão"
        text='A Crise de 1929 foi uma grande depressão econômica, que persistiu ao longo da década de 1930. A Grande Depressão é considerada o pior e o mais longo período de recessão econômica do século XX.'
        question='A Grande Depressão não afetou apenas os Estados Unidos da América, mas também países como Canadá, Reino Unido e União Soviética, produzindo um efeito mundial.'
        answer="true"
        justification='A Grande Depressão causou grande recessão econômica em diversos outros países, não só nos Estados Unidos. Em muito destes países, a Grande Depressão gerou efeitos, como o fechamento de milhares de estabelecimentos bancários, financeiros, comerciais e industriais, e a demissão de milhares de trabalhadores.'
      />
      <p className="space"></p>

      <GameCard 
        name="8"
        extension="jpg"
        relevance={3}
        personage={2}
        event={1}
        title="Bolcheviques"
        text='Os Bolcheviques eram um grupo originário do Partido POSDR, fundado em 1898. O termo bolchevismo é de origem russa e significa, literalmente, maioria.'
        question='Os Bolcheviques eram liderados por Martov e defendiam que os trabalhadores podiam conquistar o poder participando normalmente das atividades políticas.'
        answer="false"
        justification='Os Bolcheviques eram liderados por Lenin e defendiam que os trabalhadores somente chegariam ao poder pela luta revolucionária.'
      />
      <p className="space"></p>

      <GameCard 
        name="9"
        extension="jpg"
        relevance={3}
        personage={2}
        event={1}
        title="Mencheviques"
        text='Os Mencheviques eram um grupo originário do Partido POSDR, , fundado em 1898. Eram denominados mencheviques, ou minoria, os membros de um partido político russo, de tendências revolucionárias moderadas.'
        question='Os Mencheviques eram liderados por Lenin e defendiam que os trabalhadores somente chegariam ao poder pela luta revolucionária.'
        answer="false"
        justification='Os Mencheviques eram liderados por Martov e defendiam que os trabalhadores podiam conquistar o poder participando normalmente das atividades políticas.'
      />
      <p className="space"></p>

      <GameCard 
        name="10"
        extension="jpg"
        relevance={3}
        personage={1}
        event={2}
        title="Aliados"
        text='Os Aliados foram os países que se opuseram e venceram as Potências do Eixo na Segunda Guerra Mundial.'
        question='No comando da força de coalizão dos Aliados estavam os Estados Unidos, o Reino Unido e a União Soviética.'
        answer="true"
        justification='Contra os Países do Eixo se reuniram os países Aliados. Estes representavam basicamente os mesmos que formaram a Tríplice Entente durante a Primeira Guerra Mundial. No comando dessa força de coalizão estavam os Estados Unidos, o Reino Unido e a União Soviética.'
      />
      <p className="space"></p>

      <GameCard 
        name="11"
        extension="jpg"
        relevance={3}
        personage={2}
        event={1}
        title="Eixo"
        text='O Eixo foram um dos adversários da Segunda Guerra Mundial. Seus inimigos eram as forças Aliadas.'
        question='As nações que formavam as potências do Eixo tinham suas capitais identificadas como Roma, Berlim e Tóquio.'
        answer="true"
        justification='Os Países do Eixo foram os estimuladores do conflito com suas doutrinas radicais. Reuniam a Alemanha nazista sob o comando de Adolf Hitler, a Itália fascista de Benito Mussolini e o império nipônico Japonês. Os adversários identificavam o eixo a ser combatido como Roma-Berlim-Tóquio.'
      />
      <p className="space"></p>

      <GameCard 
        name="12"
        extension="png"
        relevance={3}
        personage={2}
        event={1}
        title="Tríplice Entente"
        text='A Tríplice Entente foi uma a coalizão militar constituída durante a Primeira Guerra Mundial, onde impérios se uniram para fazer frente à política expansionista de outro bloco, a Tríplice Aliança.'
        question='A Tríplice Entente foi um acordo militar entre o Império Alemão, o Império Austro-Húngaro e o Reino da Itália.'
        answer="false"
        justification='A Tríplice Entente foi uma aliança militar entre o Reino Unido, a França e o Império Russo formada para combater a Tríplice Aliança.'
      />
      <p className="space"></p>

      <GameCard 
        name="13"
        extension="png"
        relevance={1}
        personage={2}
        event={2}
        title="Tríplice Aliança"
        text='A Tríplice Aliança foi um acordo estabelecido entre impérios durante a Primeira Guerra Mundial, onde cada uma das nações garantia apoio às demais no caso de algum ataque. O objetivo principal era construir uma barreira político-militar que isolasse a França na Europa Ocidental.'
        question='A Tríplice Aliança foi uma aliança militar entre o Reino Unido, a França e o Império Russo.'
        answer="false"
        justification='A Tríplice Aliança foi um acordo militar entre o Império Alemão, o Império Austro-Húngaro e o Reino da Itália. Formando assim um grande bloco de países aliados no centro da Europa.'
      />
      <p className="space"></p>

      <GameCard 
        name="14"
        extension="jpg"
        relevance={4}
        personage={2}
        event={2}
        title="Atentado de Sarajevo"
        text='O atentado é considerado o episódio decisivo para o início da Primeira Guerra Mundial. O evento ocorreu em Sarajevo, à época, província da Áustria-Hungria.'
        question='A importante personagem da política europeia, que foi vítima do atentado era o arquiduque Francisco Ferdinando.'
        answer="true"
        justification='O atentado ao arquiduque Francisco Ferdinando, herdeiro do Império Austro-Húngaro, é considerado o episódio decisivo para o início da Primeira Guerra Mundial. O ataque a este importante personagem da política europeia ocorreu em um em Sarajevo, à época, província da Áustria-Hungria.'
      />
      <p className="space"></p>

      <GameCard 
        name="15"
        extension="jpg"
        relevance={1}
        personage={1}
        event={2}
        title="Pacto de Varsóvia"
        text='O Pacto de Varsóvia foi uma aliança militar formada pelos países socialistas do Leste Europeu e pela União Soviética após a Segunda Guerra Mundial.'
        question='Os países que fizeram parte do Pacto de Varsóvia seguiam as diretrizes soviéticas.'
        answer="true"
        justification='Os países que fizeram parte do Pacto de Varsóvia eram alguns nos quais foram instituídos governos socialistas pela União Soviética, após a Segunda Guerra Mundial. Os membros que permaneceram na aliança seguiam diretrizes soviéticas.'
      />
      <p className="space"></p>

      <GameCard 
        name="16"
        extension="jpg"
        relevance={4}
        personage={2}
        event={1}
        title="Átomo"
        text='O átomo é a menor partícula capaz de identificar um elemento químico e participar de uma reação química.'
        question='O estudo do átomo se iniciou com o filósofo romano Leucipo e seu discípulo Demócrito.'
        answer="false"
        justification='O estudo do átomo se iniciou na Grécia antiga com o filósofo Leucipo e seu discípulo Demócrito: para eles, o átomo era o menor componente de toda a matéria existente. Sendo, então, impossível dividí-lo em partes menores.'
      />
      <p className="space"></p>

      <GameCard 
        name="17"
        extension="jpg"
        relevance={2}
        personage={2}
        event={1}
        title="Átomo de Dalton"
        text='A teoria atômica de Dalton foi fundamental para o desenvolvimento do conhecimento atômico, pois serviu de base para que outros cientistas conhecessem o átomo e suas características.'
        question='Neste modelo, o átomo era uma esfera de carga elétrica positiva incrustada com elétrons, com carga negativa, tornando-se assim eletricamente neutro. Ficou conhecido como pudim de passas.'
        answer="false"
        justification='Para Dalton, a teoria de Leucipo e Demócrito era bastante coerente. Segundo este modelo, os átomos eram as menores partículas possíveis, assumiam formas esféricas e possuíam massa semelhante. Este modelo ficou conhecido como bola de bilhar.'
      />
      <p className="space"></p>

      <GameCard 
        name="18"
        extension="jpg"
        relevance={1}
        personage={2}
        event={2}
        title="Átomo de Thomson"
        text='O átomo era uma esfera de carga elétrica positiva incrustada com elétrons, com carga negativa, tornando-se assim eletricamente neutro.'
        question='Segundo este modelo, os átomos possuíam massa semelhante caso fossem correspondentes ao mesmo elemento químico.'
        answer="false"
        justification='De acordo com este novo modelo, o átomo era uma esfera de carga elétrica positiva incrustada com elétrons, com carga negativa, tornando-se assim eletricamente neutro. Ficou conhecido como pudim de passas.'
      />
      <p className="space"></p>

      <GameCard 
        name="19"
        extension="jpg"
        relevance={3}
        personage={0}
        event={1}
        title="Átomo de Rutherford"
        text='O Modelo Atômico de Rutherford corresponde a um sistema no qual os elétrons se movem em órbitas circulares, ao redor do núcleo.'
        question='O Modelo Atômico de Rutherford ficou conhecido como modelo planetário.'
        answer="true"
        justification='O Modelo Atômico de Rutherford, conhecido como modelo planetário, corresponde a um sistema planetário em miniatura, no qual os elétrons se movem em órbitas circulares, ao redor do núcleo.'
      />
      <p className="space"></p>

      <GameCard 
        name="20"
        extension="png"
        relevance={3}
        personage={0}
        event={1}
        title="Átomo de Bohr"
        text='Este modelo assemelha-se ao modelo planetário. Contudo, nesta teoria os elétrons estão distribuídos em camadas ao redor do núcleo.'
        question='Neste modelo os elétrons estão distribuídos em camadas ao redor do núcleo. De acordo com o autor, existem 8 camadas eletrônicas em um átomo.'
        answer="false"
        justification='Existem 7 camadas eletrônicas, representadas pelas letras maiúsculas: K, L, M, N, O, P e Q. À medida que as camadas se afastam do núcleo, aumenta a energia dos elétrons nelas localizados.'
      />
      <p className="space"></p>

      <GameCard 
        name="22"
        extension="png"
        relevance={2}
        personage={1}
        event={1}
        title="Próton"
        text='O próton ou protão é uma partícula subatômica, de símbolo p ou p⁺, com uma carga elétrica elementar.'
        question='Um próton possui carga elétrica positiva +1e carga elementar.'
        answer="true"
        justification='O próton ou protão é uma partícula subatômica, de símbolo p ou p⁺, com uma carga elétrica positiva de +1e carga elementar e com uma massa ligeiramente menor do que a de um nêutron.'
      />
      <p className="space"></p>

      <GameCard 
        name="22"
        extension="png"
        relevance={3}
        personage={2}
        event={1}
        title="Elétron"
        text='O elétron é uma partícula subatômica, de símbolo e− ou β− , com carga elétrica.'
        question='O elétron possui carga elétrica negativa −1 e.'
        answer="true"
        justification='O elétron é uma partícula subatômica, com carga elétrica negativa. A massa do elétron é aproximadamente 1/1836 da massa do próton.'
      />
      <p className="space"></p>

      <GameCard 
        name="22"
        extension="png"
        relevance={3}
        personage={0}
        event={1}
        title="Nêutron"
        text='Nêutron (n) é uma pequena partícula que constitui o núcleo do átomo. É formada por partículas ainda menores, as quais recebem o nome de quarks.'
        question='O nêutron é uma partícula que não possui carga ou é considerado uma partícula de carga nula.'
        answer="true"
        justification='Nêutron (n) é uma pequena partícula que constitui o núcleo do átomo. Não tem carga e junto com os prótons (p+), que têm carga positiva, os nêutrons formam o centro do átomo, o seu núcleo.'
      />
      <p className="space"></p>

      <GameCard 
        name="22"
        extension="png"
        relevance={3}
        personage={1}
        event={0}
        title="Cátion"
        text='O cátion ou catião é um íon com carga. É qualquer espécie cuja carga seja igual ou um múltiplo da carga do próton.'
        question='Cátions são considerados íons de carga negativa.'
        answer="false"
        justification='O cátion ou catião é um íon com carga positiva. É qualquer espécie cuja carga seja igual ou um múltiplo da carga do próton. É formado pela perda de elétrons da camada de valência de um átomo.'
      />
      <p className="space"></p>

      <GameCard 
        name="22"
        extension="png"
        relevance={1}
        personage={2}
        event={2}
        title="Ânion"
        text='Um ânion ou anião é um íon com carga. Eles são metais que se ligam a metais formando a ligação iônica.'
        question='Ânions são considerados íons de carga positiva.'
        answer="false"
        justification='Um ânion ou anião é um íon com carga negativa. Eles são metais que se ligam a metais formando a ligação iônica, quando em ligação, esses metais, por terem alta eletronegatividade, tendem a atrair elétrons do metal com o qual está se ligando, então esse metal se transforma num cátion (carga positiva), pois perde elétrons e esse metal se transforma num ânion(carga negativa), pois ganha elétrons.'
      />
      <p className="space"></p>
     
    </div>

const authCondition = ( authUser ) => !!authUser

export default withAuthorization( authCondition )( HomePage )
