import Work from '../models/work';

export const getWork = (req, res) => {
};

export const addWork = (req, res) => {
  const work = new Work({
  });

  work.save()
    .then(savedWork => {
      res.status(200).send(savedWork);
    })
    .catch(err => {
      res.status(403).send(err);
    });
};

export const updateWork = (req, res) => {
};

export const removeWork = (req, res) => {
};