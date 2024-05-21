import React from 'react';
import "./about.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Helmet } from 'react-helmet-async';


function ContactPage() {
  return (
      <>
      <Helmet>
        <title>qui sommes nous ?</title>
        <meta name="description" content="Nous sommes une équipe de développeurs web passionnés,
         unis par notre engagement à créer des solutions innovantes. Notre première création est une
          application web pour les locations de voitures, conçue avec soin pour offrir une expérience 
          fluide et intuitive à nos utilisateurs. Forts de cette réussite,
         nous sommes animés par une ambition débordante ..."/>      </Helmet>
      <Navbar />
      <Header/>
    <div class="containerg">
  <div class="contentLeft">
    <div class="row">
        <div class="imgWrapper">
<img src="https://images.pexels.com/photos/9553909/pexels-photo-9553909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />        </div>
        <div class="imgWrapper">
        <img src="https://images.pexels.com/photos/7988123/pexels-photo-7988123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />      
        </div>
        <div class="imgWrapper">
        <img src="https://images.pexels.com/photos/6325991/pexels-photo-6325991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />       
        </div>
        <div class="imgWrapper">
        <img src="https://images.pexels.com/photos/7869312/pexels-photo-7869312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />     
        </div>
    </div>
  </div>
  <div class="contentRight">
    <div class="content">
      <h4 style={{display:"none"}}>Welcome To</h4>
      <h2>Qui sommes-nous ?</h2>
      <p>Nous sommes une équipe de développeurs web passionnés, unis par notre engagement 
        à créer des solutions innovantes. Notre première création est une application web pour la location 
        de voitures, conçue avec soin pour offrir une expérience fluide et intuitive à nos utilisateurs. 
        Forts de cette réussite, nous sommes animés par une ambition débordante, prêts à relever de nouveaux défis 
        et à concrétiser de nouvelles idées. Nous croyons fermement à l'importance du feedback et de la collaboration, 
        et nous accueillons avec enthousiasme toutes les suggestions pour améliorer nos projets existants et donner vie à 
        de nouveaux concepts. Notre équipe est déterminée à continuer à innover et à élargir notre portefeuille de projets, 
        afin de répondre aux besoins changeants de nos utilisateurs et de la communauté en ligne. Avec chaque ligne de code que nous écrivons
        , nous aspirons à redéfinir les normes de l'excellence dans le monde du développement web.</p>
      <a href="/contact">contactez-nous</a>
    </div>
  </div>
  
</div>
<Footer />
</>
  );
}

export default ContactPage;
