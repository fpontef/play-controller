const express = require('express');
const router = express.Router();
const { auth, onlyAdmin } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Singer = require('../../models/Singer');
const User = require('../../models/User');

// @route   GET api/singers
// @desc    Get current singers list
// @access  Public
router.get('/', async (req, res) => {
  try {
    const singers = await Singer.find({ position: { $ne: null }, isActive: true })
    /**
     * if(singers.length === 0) {
      return res.status(400).json({ msg: 'Conteúdo não encontrado.' });
    }
     **/

    res.json(singers);
  } catch(err) {

    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/singers
// @desc    Create a Singer.
// @access  Private
router.post('/', 
  [
    auth, 
    check('name', 'Nome do cantor é obrigatório.')
    .not()
    .isEmpty(),
    check('music_name', 'Nome da música é obrigatório.')
    .not()
    .isEmpty(),
    check('music_id', 'Código da música é obrigatório.')
    .not()
    .isEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      music_name,
      music_id,
    } = req.body;

    try {
      // Build singer object
      const singerFields = {};
      const filter = { position: { $ne: null }, isActive: true };

      // `findOne` retorna o object, `find` retorna um array de objeto null ou com um único objeto no caso abaixo (usando limit)
      // Optei por findOne pela facilidade de buscar
      const findLastSinger = await Singer.findOne(filter)
        .sort({ position: -1 })
        .limit(1);
      
      if (findLastSinger) {
        const lastSingerPos = findLastSinger.position;
        singerFields.position = lastSingerPos + 1;
      } else {
        singerFields.position = 0;
      }

      singerFields.updatedBy = req.user.id;
      if(name) singerFields.name = name;
      if(music_name) singerFields.music_name = music_name;
      if(music_id) singerFields.music_id = music_id;

      // Create new Singer
      const newSinger = new Singer({ ...singerFields });

      await newSinger.save();

      res.json(newSinger);
    } catch(err) {
      res.status(500).send('Server Error.');
    }

  });

// @route   GET api/singers/:singer_id
// @desc    Get singer by singer_id
// @access  Public
router.get('/:singer_id', async (req, res) => {
  try {
    const singer = await Singer.findOne({ _id: req.params.singer_id })
      .populate('updatedBy', ['login']);

    if(!singer) return res.status(400).json({ msg: 'Cantor não encontrado.' });

    res.json(singer);
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Cantor não encontrado.' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/singers/:singer_id
// @desc    Update singer by singer_id
// @access  Private
router.put('/:singer_id', auth, async (req, res) => {
  const {
    name,
    music_name,
    music_id,
  } = req.body;
  
  try {
    const newData = {
      name,
      music_name,
      music_id,
      updatedBy: req.user.id
    };
    const singer = await Singer.findByIdAndUpdate(req.params.singer_id, newData, { new: true });

    if(!singer) return res.status(400).json({ msg: 'Cantor não encontrado.' });

    res.status(200).json(singer);
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Cantor não encontrado.' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/singers/next/:singer_id
// @desc    Update to nextInQueue to true by singer_id
// @access  Private & Admin
router.put('/next/:singer_id', auth, onlyAdmin, async (req, res) => {
  try {
    const newData = {
      nextInQueue: true,
      updatedBy: req.user.id
    };
    const singer = await Singer.findByIdAndUpdate(req.params.singer_id, newData, { new: true });

    if(!singer) return res.status(400).json({ msg: 'Cantor não encontrado.' });

    res.status(200).json(singer);
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Cantor não encontrado.' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/singers/sing/:singer_id
// @desc    Update to isSinging to true by singer_id
// @access  Private
router.put('/sing/:singer_id', auth, async (req, res) => {
  try {
    // TODO: Get a list, map and filter to avoid 4 MongoDB Operations.
    const isSingingList = await Singer.find({ isActive: true, isSinging: true }).limit(1);
    if (isSingingList.length > 0) return res.status(400).json({ msg: 'Já existe alguém cantando.' });

    const singer = await Singer.findById(req.params.singer_id);
    if(!singer) return res.status(400).json({ msg: 'Cantor não encontrado.' });

    const allowedSinger = await Singer.findOne({ nextInQueue: false, isActive: true, isSinging: false })
    .sort({ position: 1 })
    .limit(1);

    if( singer.position !== allowedSinger.position && singer.nextInQueue === false ) {
      return res.status(401).json({ msg: 'Ação não autorizada.' });
    }
    
    // Finally allow update to new Singer:
    const newData = {
      isSinging: true,
      updatedBy: req.user.id
    };
    const newSinger = await Singer.findByIdAndUpdate(req.params.singer_id, newData, { new: true });
    
    if(!newSinger) return res.status(400).json({ msg: 'Erro na alteração do Cantor ou não encontrado.' });

    res.status(200).json({ msg: "Cantor alterado." });
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Cantor não encontrado.' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/singers/:singer_id
// @desc    Delete a singer by singer_id, marking isActive AND isSinging as false.
// @access  Private
router.delete('/:singer_id', auth, async (req, res) => {
  try {
    const newData = {
      isSinging: false,
      isActive: false,
      updatedBy: req.user.id
    };
    const singer = await Singer.findByIdAndUpdate(req.params.singer_id, newData);
    
    if(!singer) return res.status(400).json({ msg: 'Cantor não encontrado.' });
    
    res.status(201).send('Cantor desativado.');
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Cantor não encontrado.' });
    }
    res.status(500).send('Server Error');
  }

});

module.exports = router;
