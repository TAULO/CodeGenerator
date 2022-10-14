import React from "react"
import { graphql, Link } from "gatsby"
import "./annotations.css"
import Header from "src/components/header"
import Footer from "src/components/footer"
import News from "src/components/lastnews"
import Title from "src/components/title"
const AnnotationsPage = () => {
  return (
    <div>
      <Header />
      <Title> Анотації дисциплін </Title>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> Вільний вибір бакалавр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F01.pdf&clen=72776&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Технології анімації.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F02.pdf&clen=281627&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Основи технології та дизайну паковань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F03.pdf&clen=80857&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Системи управління технологічного процесу підготовки видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F04.pdf&clen=120122&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Обробка аудіо інформації.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F05.pdf&clen=103078&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Обробка відео інформації.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F06.pdf&clen=122067&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Поліграфічні матеріали.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F07.pdf&clen=121648&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Технології цифрового друку.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F08.pdf&clen=124971&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Технологія оперативних та спеціальних видів друку.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F09.pdf&clen=101649&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Тривимірне моделювання.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F11.pdf&clen=284251&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Візуальні комунікації.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F12.pdf&clen=83004&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Менеджмент в видавничо - поліграфічній справі.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F13.pdf&clen=89605&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Основи маркетингу та рекламної діяльності.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F14.pdf&clen=115309&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Основи редагування та коректури видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F15.pdf&clen=110763&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Патентознавство та авторське право.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F16.pdf&clen=116205&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Шрифтові технології.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F19.pdf&clen=88458&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Комп’ ютерні мережі.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F18.pdf&clen=401236&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Технології проєктування комп’ ютерних ігор.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F17.pdf&clen=87764&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Основи UI / UX.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fvilnij-vibir-bakalavr%2F20.pdf&clen=94928&chunk=true"
                  className="annotations__link"
                  target="_blank"
                >
                  Технології комп’ ютерної візуалізації.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> Бакалавр вибір ВНЗ. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F2.pdf&clen=281754&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи графічного дизайну.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F3.pdf&clen=58354&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи теорії кольору та кольоровідтворення.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F4.pdf&clen=114473&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Програмні засоби комп 'ютерних видавничих систем.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F5.pdf&clen=107875&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування і розрахунки технологічних процесів підготовки та
                  виготовлення видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F6.pdf&clen=82293&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Системи управління кольором.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F7.pdf&clen=104572&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Теоретичні основи растрування.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-vnz%2F8.pdf&clen=282739&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Художні основи проєктування видань.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> Бакалавр нормативні. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F01.pdf&clen=105290&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Атестаційна робота бакалавра.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F02.pdf&clen=75687&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Введення в спеціальність.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F03.pdf&clen=83720&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Вузли та механізми поліграфічного устаткування.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F04.pdf&clen=124518&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Інженерна та комп 'ютерна графіка.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F05.pdf&clen=135091&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Інформатика.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F06.pdf&clen=60234&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Обробка графічної інформації.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F07.pdf&clen=130641&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Оброблення текстової інформації.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F08.pdf&clen=81543&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи метрології стандартизації та управління якістю.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F09.pdf&clen=107927&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи технології поліграфічного виробництва.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F10.pdf&clen=105398&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технічна механіка.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F11.pdf&clen=82109&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Фотореєстраційні та формні процеси.
                </a>
              </li>
              <li className="annotations__list__item">
                <a href="#" target="_blank" className="annotations__link">
                  Основи матеріалознавства.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fbakalavr-normativ%2F12.pdf&clen=109591&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технічні засоби у видавничо - поліграфічній справі.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> Магістр нормативні. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fmagistr-normativ%2F1.pdf&clen=122701&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи наукових досліджень та організація науки.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fmagistr-normativ%2F2.pdf&clen=105766&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Системний аналіз та підтримка прийняття рішень.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fmagistr-normativ%2F3.pdf&clen=121562&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Моделювання технічних систем.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fmagistr-normativ%2F4.pdf&clen=122295&chunk=trueА"
                  target="_blank"
                  className="annotations__link"
                >
                  Математична статистика і опрацювання даних.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> КТСВПВ бакалавр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-bakalavr%2Fosnovi-web-tekhnologij.pdf&clen=51735&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи WEB - технологій.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-bakalavr%2Ftekhnologiya-ta-obladnannya-poligrafichnikh-protsesiv.pdf&clen=122754&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технологія та обладнання поліграфічних процесів.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-bakalavr%2Fproektuvannya-kompyuternikh-vidavnichikh-sistem-ta-komponentiv.pdf&clen=121985&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування комп’ ютерних видавничих систем та компонентів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-bakalavr%2Ftekhnologiya-pidgotovki-elektronnikh-vidan.pdf&clen=79404&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технологія підготовки електронних видань.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> КТСВПВ магістр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F01.pdf&clen=143694&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка кросмедійних продуктів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F03.pdf&clen=88992&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Просування кросмедійних продуктів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F07.pdf&clen=111053&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Захист інформації в поліграфії.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F08.pdf&clen=86264&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Оцінка якості поліграфічної продукції.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F09.pdf&clen=399545&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Розробка та моделювання бізнес - процесів поліграфічного
                  виробництва.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F11.pdf&clen=96615&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Системи автоматизованого управління видавничими поліграфічними
                  процесами.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F12.pdf&clen=90310&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка інтерфейсів інтерактивних видань.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F14.pdf&clen=114535&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Управління проєкт єктами.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F2.pdf&clen=58622&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Анімація в мобільних додатках.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F13.pdf&clen=92563&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технології розробки мультимедійних інформаційних продуктів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F8.pdf&clen=88047&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Тестування та забезпечення якості мобільних додатків.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F1.pdf&clen=75558&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка мобільних додатків.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F1.pdf&clen=75558&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Новітні технології та матеріали.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F3.pdf&clen=135997&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Internet - маркетинг.
                </a>
              </li>
              <li className="annotations__list__item">
                <a href="#" target="_blank" className="annotations__link">
                  Організація та управління поліграфічним виробництвом.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> ТДВ бакалавр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-bakalavr%2Fekspluatatcia-poligrafichnogo-obladnannya.pdf&clen=97818&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Експлуатація поліграфічного обладнання.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-bakalavr%2Fosnovi-proektuvannya-elektronnikh-vidan.pdf&clen=85885&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Основи проєктування електронних видань.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-bakalavr%2Fproektuvannya-poligrafichnogo-virobnitstva.pdf&clen=84765&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування поліграфічного виробництва.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-bakalavr%2Ftekhnologiya-ta-obladnannya-drukar-ta-pislyadruk-protsesiv.pdf&clen=85564&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технологія та обладнання друкарських та післядрукарських
                  процесів.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> ТДВ магістр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F01.pdf&clen=143694&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технології захисту друкованої продукції.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F14.pdf&clen=114535&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Управління проєктами.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F2.pdf&clen=77375&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Оперативні та спеціальні види друку.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F3.pdf&clen=97506&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Організація та управління видавничо - поліграфічним
                  виробництвом.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F4.pdf&clen=86264&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Оцінка якості поліграфічної продукції.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F5.pdf&clen=396901&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Системи автоматизованого управління процесами поліграфічного
                  виробництва.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F6.pdf&clen=85903&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технології проєктування та виготовлення пакувань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F03.pdf&clen=88992&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Просування кросмедійних продуктів.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F7.pdf&clen=398431&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Розробка та моделювання видавничих технологічних процесів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F01.pdf&clen=143694&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка кросмедійних продуктів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F01.pdf&clen=143694&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка кросмедійних продуктів.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F8.pdf&clen=88047&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Тестування та забезпечення якості мобільних додатків.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F8.pdf&clen=90310&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка інтерфейсів інтерактивних видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F15.pdf&clen=108679&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Новітні технології та матеріали.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> ТЕМВ бакалавр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-bakalavr%2Fweb-tekhnologiii.pdf&clen=52668&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  WEB - технології.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-bakalavr%2Fosnovi-proektuvannya-elektronnikh-vidan.pdf&clen=85885&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Комп 'ютерні технології виготовлення реклами для друкованих та
                  електронних ЗМІ.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-bakalavr%2Fproektuvannya-elektronnikh-multimedijnikh-vidan.pdf&clen=80746&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування електронних мультимедійних видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-bakalavr%2Ftexnichni-zasoby-mediatechnologij.pdf&clen=78426&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Технічні засоби медіатехнологій.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="annotations">
        <div className="container">
          <div className="annotations__title"> ТЕМВ магістр. </div>
          <div className="annotations__inner">
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F1.pdf&clen=75558&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка мобільних додатків.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F2.pdf&clen=58622&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Анімація в мобільних додатках.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F3.pdf&clen=135997&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Internet - маркетинг.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F4.pdf&clen=50821&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка WEB - систем.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F5.pdf&clen=47226&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  WEB - аналітика та пошукова оптимізація.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F6.pdf&clen=92938&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Бази даних в мультимедійних системах.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F7.pdf&clen=179416&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  UI / UX мультимедійних продуктів.
                </a>
              </li>
            </ul>
            <ul className="annotations__list">
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftemv-magistr%2F8.pdf&clen=88047&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Тестування та забезпечення якості мобільних додатків.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F14.pdf&clen=114535&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Управління проєктами.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F8.pdf&clen=90310&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Проєктування та розробка інтерфейсів інтерактивних видань.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Ftdv-magistr%2F4.pdf&clen=86264&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Оцінка якості поліграфічної продукції.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F15.pdf&clen=108679&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Новітні технології та матеріали.
                </a>
              </li>
              <li className="annotations__list__item">
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/viewer.html?pdfurl=http%3A%2F%2Fmst.nure.ua%2Fimages%2Fanotatsiyi-distsiplin-2019%2Fktsvpv-magistr%2F03.pdf&clen=88992&chunk=true"
                  target="_blank"
                  className="annotations__link"
                >
                  Просування кросмедійних продуктів.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <News />
      <Footer />
    </div>
  )
}

export default AnnotationsPage

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
