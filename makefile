EXE=emoji_minigames

DEP=mime_types

PKG=./pkg
SRC=./src
BIN=./bin

all: $(EXE) cleandeps

$(EXE): $(SRC)/$(EXE).🍇 $(DEP)
	@emojicodec $(SRC)/$@.🍇 -S $(PKG)
	@mv $(SRC)/*.o $(BIN)
	@mv $(SRC)/$@ .

mime_types: $(SRC)/mime_types.🍇
	@mkdir -p $(PKG)/$@
	@emojicodec -p $@ $(SRC)/$@.🍇
	@mv -t $(PKG)/$@ $(SRC)/🏛 $(SRC)/lib$@.a

cleandeps:
	rm -rf $(BIN)/*.o $(PKG)/*

clean:
	rm -rf $(EXE) $(BIN)/*.o $(PKG)/*
