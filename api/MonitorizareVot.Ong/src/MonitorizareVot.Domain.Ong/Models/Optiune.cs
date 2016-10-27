﻿using System;
using System.Collections.Generic;

namespace MonitorizareVot.Domain.Ong.Models
{
    public partial class Optiune
    {
        public Optiune()
        {
            Raspuns = new HashSet<Raspuns>();
            RaspunsDisponibil = new HashSet<RaspunsDisponibil>();
        }

        public int IdOptiune { get; set; }
        public bool SeIntroduceText { get; set; }
        public string TextOptiune { get; set; }

        public virtual ICollection<Raspuns> Raspuns { get; set; }
        public virtual ICollection<RaspunsDisponibil> RaspunsDisponibil { get; set; }
    }
}