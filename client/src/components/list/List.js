import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonFloat from "./ButtonFloat";
import Singer from "./Singer";
import { connect } from "react-redux";
import { getSingers } from "../../actions/singer";

const List = ({ getSingers, singer: { singers, isLoading } }) => {
  useEffect(() => {
    getSingers();
    const interval = setInterval(() => {
      getSingers();
    }, 10000);
    return () => clearInterval(interval);
  }, [getSingers]);

  if (singers.length !== 0 && !isLoading) {
    return (
      <Fragment>
        <h1 className="large text-primary">Artistas</h1>
        <ul>
          {
            singers
              .filter((singer) => singer.isSinging && !singer.nextInQueue)
              .map((singer) => (
                <Singer
                  key={singer._id}
                  singerId={singer._id}
                  singerName={singer.name}
                  singerOrder={singer.position}
                  musicName={singer.music_name}
                  musicId={singer.music_id}
                  isSinging={singer.isSinging}
                  nextInQueue={singer.nextInQueue}
                />
              )) //map
          }
          {
            singers
              .filter((singer) => !singer.isSinging && singer.nextInQueue)
              .map((singer) => (
                <Singer
                  key={singer._id}
                  singerId={singer._id}
                  singerName={singer.name}
                  singerOrder={singer.position}
                  musicName={singer.music_name}
                  musicId={singer.music_id}
                  isSinging={singer.isSinging}
                  nextInQueue={singer.nextInQueue}
                />
              )) //map
          }
          {
            // se necessário, incluir .sort() ou testar "new Map()"
            singers
              .filter((singer) => !singer.isSinging && !singer.nextInQueue)
              .map((singer, index) => (
                <Singer
                  key={singer._id}
                  singerId={singer._id}
                  singerName={singer.name}
                  singerOrder={singer.position}
                  musicName={singer.music_name}
                  musicId={singer.music_id}
                  isSinging={singer.isSinging}
                  nextInQueue={singer.nextInQueue}
                />
              )) //map
          }
        </ul>

        <ButtonFloat />
      </Fragment>
    );
  }

  return <div>Sem cantores, adicione um!</div>;
};

List.propTypes = {
  singer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  singer: state.singer,
});

export default connect(mapStateToProps, { getSingers })(List);
