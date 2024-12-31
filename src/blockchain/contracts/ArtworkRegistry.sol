// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArtworkRegistry {
    struct Artwork {
        string title;
        string imageURL;
        string description;
        address owner;
        uint256 timestamp;
    }

    Artwork[] public artworks;

    event ArtworkRegistered(string title, address owner, uint256 timestamp);

    function registerArtwork(
        string memory _title,
        string memory _imageURL,
        string memory _description
    ) public {
        artworks.push(
            Artwork({
                title: _title,
                imageURL: _imageURL,
                description: _description,
                owner: msg.sender,
                timestamp: block.timestamp
            })
        );
        emit ArtworkRegistered(_title, msg.sender, block.timestamp);
    }

    function getArtwork(uint256 index)
        public
        view
        returns (
            string memory title,
            string memory imageURL,
            string memory description,
            address owner,
            uint256 timestamp
        )
    {
        Artwork memory art = artworks[index];
        return (art.title, art.imageURL, art.description, art.owner, art.timestamp);
    }

    function getArtworksCount() public view returns (uint256) {
        return artworks.length;
    }
}
